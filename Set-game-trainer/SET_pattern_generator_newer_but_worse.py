# check set probabilities as cards are added.

import itertools
import random
from pathlib import Path
from collections import defaultdict
import copy

import time

import sqlite3
import json

# set pattern properties
PATTERN_ROWS = 9
PATTERN_COLS = 9
PATTERN_WINDOW_ROWS = 3
PATTERN_WINDOW_COLS = 4

window_set_count_buffer = {}
window_set_count_buffer_hits = 0
window_set_count_buffer_non_hits = 0
# Set
# card options
PROPERTIES_COUNT = 3
VALUES_COUNT = 4
parameters = {"quantity": ["1", "2", "3"], "colour": ["Red", "Green", "Blue"], "infill": [
    "open", "hatched", "solid"], "shape": ["Squiggle", "Pill", "Diamond"]}
parameters_single_char = {"quantity": ["1", "2", "3"], "colour": [
    "R", "G", "B"], "infill": ["o", "h", "s"], "shape": ["S", "P", "D"]}


def create_deck(parameters, formatted=False, shuffled=True):
    # provide dict with all parameters and their values.
    # a deck will be created from all the combinations.
    combinations = list(itertools.product(*parameters.values()))

    if formatted:
        combinations = [
            dict(zip(parameters.keys(), combo)) for combo in combinations
        ]

    if shuffled:
        random.shuffle(combinations)

    # print("faefeieieijijeeijeijeij {}".format(combinations))

    return combinations

def is_set(three_cards, verbose=False):
    # cards as lists

    # check for none cards:
    if None in three_cards:
        return False

    for property_value_1,property_value_2,property_value_3 in zip(*three_cards):
        if property_value_1 == property_value_2 == property_value_3:
            # no need to count, if even one property does not pass, returns False right away
            pass
        elif property_value_1 != property_value_2 and  property_value_1 != property_value_3 and property_value_2 != property_value_3:
            # no need to count, if even one property does not pass, returns False right away
            pass
        else:
            return False
    return True
# def is_set(three_cards, verbose=False):
#     # cards as lists

#     # check for none cards:
#     if None in three_cards:
#         return False

#     # bundle per property
#     separated_per_property = list(zip(*three_cards))

#     # check
#     for p in separated_per_property:
#         assert len(p) == PROPERTIES_COUNT, "Incorrect card "

#     separated_per_property_as_different_values = [
#         set(p) for p in separated_per_property]

#     is_set = True
#     # check for all values diff or all equal per parameter SET fulfillment requirement
#     for diff_values in separated_per_property_as_different_values:
#         diff_count = len(diff_values)
#         if diff_count == 1 or diff_count == PROPERTIES_COUNT:
#             pass
#         else:
#             is_set = False
#     if verbose:
#         print("SET") if is_set else print("No SET")

#     # for card in three_cards:
#     return is_set


def check_for_set_from_random_draw_from_full_deck(deck):

    random_cards = []
    for i in range(3):
        position = random.randint(0, len(deck)-1)
        card = deck[position]
        random_cards.append(card)
    print(*random_cards)
    is_set(random_cards)


def set_in_cards(cards, verbose=False, count_sets=False, if_more_than_one_return_high=False):
    global window_set_count_buffer_hits
    global window_set_count_buffer_non_hits

    if count_sets:
        cards_tuple = tuple(cards)
        value = window_set_count_buffer.get(cards_tuple)
        if value is not None:
            window_set_count_buffer_hits += 1
            return value
        else:
            window_set_count_buffer_non_hits += 1 
            
    if len(cards) < 3:
        return False
    # check if there is a set in cards
    combinations_of_three_cards = list(itertools.combinations(cards, 3))
    # 220 for 12 cards print(len(combinations_of_three_cards))
    sets_count = 0
    for three_cards in combinations_of_three_cards:
        if verbose:
            print(three_cards)
        if is_set(three_cards, verbose=False):
            if verbose:
                print("SET FOUND")
                print(three_cards)
            sets_count += 1

        if not count_sets:
            return True
        # else:
        #     if if_more_than_one_return_high:
        #         if sets_count > 1:
        #             # optimizes slightly, but not worth it...
        #             return 10
            

    if not count_sets:
        return False
    else:
        window_set_count_buffer[cards_tuple] = sets_count
        return sets_count


class db_SET_analytics():
    def __init__(self, db_path):
        self.conn = sqlite3.connect(db_path)
        self.cursor = self.conn.cursor()
        self.check_integrity()

    def execute_sql(self, sql_str):

        try:
            self.cursor.execute(sql_str)
            self.conn.commit()
        except sqlite3.IntegrityError as e:
            if "UNIQUE constraint failed" in str(e):
                print(f"Duplicate entry ignored: {e}")
            else:
                raise  # Reraise other IntegrityErrors
        except Exception as e:
            print(
                f"An error occurred, not saved to db. Program will continue.: {e}")

    def check_integrity(self):
        # Function to check if a table exists
        if not (self.table_exists("set_patterns")):
            # print("DB not OK. Uncomment next lines to create table. ")
            self.create_table_set_patterns()

    def add_pattern(self, set_pattern_dict):
        
        # print(len(self.patterns_and_swapped_positions_memory[pattern_compact]))
        # Function to store a list in the database
        pattern = set_pattern_dict["pattern"]

        window_stats = set_pattern_dict["window_stats"]
        tried_position_swaps = set_pattern_dict["tried_position_swaps"]

        single_set_windows = window_stats[1]
        pattern_weight = set_pattern_dict["pattern_weight"]
        
        position_swap_length = len(tried_position_swaps)

        # Convert the list to JSON
        json_pattern = pattern
        json_window_stats = json.dumps(window_stats)
        json_tried_position_swaps = json.dumps(tried_position_swaps)
        
        if position_swap_length == 3240:
            json_tried_position_swaps = "DONE"
        pattern_dict = self.get_pattern_if_existing(json_pattern)
        if pattern_dict is None:
            
            sql_str = "INSERT INTO set_patterns (pattern, window_stats, single_set_windows, pattern_weight, position_swap_length, tried_position_swaps) VALUES ('{}','{}','{}','{}','{}','{}')".format(
                    json_pattern, json_window_stats, single_set_windows, pattern_weight, position_swap_length , json_tried_position_swaps
                )
            
            self.execute_sql(sql_str
                )
        else:
            # update json_tried_position swaps
            
            sql = "UPDATE set_patterns SET position_swap_length='{}',tried_position_swaps='{}' WHERE pattern = '{}'".format(
                    position_swap_length,json_tried_position_swaps, json_pattern 
                )
            self.execute_sql( sql )
             
            # print(pattern_dict)

            # print ("exists in table : {} ".format(json_pattern))
            #  update the pattern positions "tried_positions_swap"

            # update the record with the
            pass

    def table_exists(self, table_name):
        self.cursor.execute("""
            SELECT name 
            FROM sqlite_master 
            WHERE type='table' AND name=?;
        """, (table_name,))
        return self.cursor.fetchone() is not None

    def create_table_set_patterns(self):
        # Create a table
        self.cursor.execute("""
        CREATE TABLE IF NOT EXISTS set_patterns (
            pattern TEXT PRIMARY KEY,
            window_stats TEXT,
            single_set_windows INTEGER,
            pattern_weight INTEGER,
            position_swap_length INTEGER,
            tried_position_swaps TEXT
        )
        """)

    
    
    def get_pattern_data(self, compact_pattern_json):
        
        self.cursor.execute("""
            SELECT * FROM set_patterns
            WHERE pattern='{}'
            LIMIT 1
            """.format(compact_pattern_json))
        
        record = self.cursor.fetchone()
        # print(record)
        if record is None:
            return None
        else:
            return self.convert_record_to_pattern_dict(record)
        
        
    def get_pattern_with_most_single_set_windows(self):
        self.cursor.execute(f"""
            SELECT * FROM set_patterns
            ORDER BY single_set_windows DESC
            LIMIT 1
            """)

        record = self.cursor.fetchone()
        if record is None:
            return None
        else:
            return self.convert_record_to_pattern_dict(record)
        
    def get_pattern_with_best_weight_not_exhausted(self):
        self.cursor.execute(f"""
            SELECT * FROM set_patterns
            WHERE position_swap_length < 3240
            ORDER BY pattern_weight ASC
            LIMIT 1
            """)

        record = self.cursor.fetchone()
        # print(record)
        if record is None:
            return None
        else:
            return self.convert_record_to_pattern_dict(record)
        
        
    def get_pattern_if_existing(self, compact_pattern):
        query = "SELECT * FROM set_patterns WHERE pattern = '{}' LIMIT 1".format(
            compact_pattern)

        self.cursor.execute(query)
        record = self.cursor.fetchone()
        if record is None:
            return None
        else:
            return self.convert_record_to_pattern_dict(record)

    def convert_record_to_pattern_dict(self, record):

        pattern_json, window_stats_json, single_set_windows, pattern_weight, position_swap_length, tried_position_swaps = record
        pattern = json.loads(pattern_json)
        window_stats = json.loads(window_stats_json)
        single_set_windows = int(single_set_windows)
        pattern_weight = int(pattern_weight)
        if (tried_position_swaps) == "DONE":
            print("Why was this pattern loaded? It was exhausted. {}".format(pattern_json))
            tried_position_swaps_list_of_lists = []
            
        else:
            tried_position_swaps_list_of_lists = json.loads(tried_position_swaps)
        # print(tried_position_swaps)
        tried_position_swaps = [tuple((tuple(pos1), tuple(pos2))) for pos1, pos2 in tried_position_swaps_list_of_lists]

        position_swap_length =  int(position_swap_length)
        if len(tried_position_swaps) != position_swap_length:
            # print("ASERT ERROR : Anomaly in db. len of list not equal to stored length of list of swapped positions.".format(len(tried_position_swaps), position_swap_length))
            AssertionError 
            
        return {"pattern": pattern, "window_stats": window_stats_json, "single_set_windows": single_set_windows, "pattern_weight": pattern_weight, "tried_position_swaps": tried_position_swaps}

    def get_pattern_with_best_pattern_weight(self):
        self.cursor.execute(f"""
            SELECT * FROM set_patterns
            ORDER BY pattern_weight DESC
            LIMIT 1
            """)

        row = self.cursor.fetchone()
        pattern_json, window_stats_json, single_set_windows, pattern_weight, tried_position_swaps = row

        pattern = json.loads(pattern_json)
        window_stats_json = json.loads(window_stats_json)
        single_set_windows = int(single_set_windows)
        pattern_weight = int(pattern_weight)
        tried_position_swaps = json.loads(tried_position_swaps)
        return {"pattern": pattern, "window_stats_json": window_stats_json, "single_set_windows": single_set_windows, "pattern_weight": pattern_weight, "tried_position_swaps": tried_position_swaps}


class SET():

    def __init__(self):
        self.reset_pattern()
        self.patterns_and_swapped_positions_memory = defaultdict(list)
        

    def setup_db(self, db_path):
        self.db_set = db_SET_analytics(db_path)

    def add_current_situation_to_db(self):
        self.calculate_all_pattern_stats()

        onepattern_dict = self.get_pattern_as_dict()
        self.db_set.add_pattern(onepattern_dict)

    def reset_pattern(self):
        self.deck = create_deck(parameters, False, True)
        self.total_pattern_weight = 0
        
        # normal pattern: 9x9. But, to handle the edge cases: we extend the 9x9 pattern 2x2  so: 18x18. where (0,0) == (9,0) == (0,9) == (9,9)
        self.pattern_extended = {(row, col): None for row in range(
            PATTERN_ROWS * 2) for col in range(PATTERN_COLS*2)}
        self.pattern_tagged_positions = {(row, col): 0 for row in range(
            PATTERN_ROWS * 2) for col in range(PATTERN_COLS * 2)}

        # top left corner of a cards window in the pattern. every position contains the amount of sets in the window with position as upper left corner of this window.
        self.set_counts_pattern = {(row, col): 0 for row in range(
            PATTERN_ROWS) for col in range(PATTERN_COLS)}
        self.basic_pattern_positions = self.get_all_basic_pattern_positions()
        self.sets_count_window_distribution = None
        self.i = 0

    def card_compact_to_normal(self, compact_card):

        #  'Squiggle'), (15, 17): ('2', 'Blue', 'solid', 'Squiggle'), (16, 17): ('2', 'Blue', 'hatched', 'Diamond'), (17, 17): ('3', 'Blue', 'open', 'Pill')}

        card = []
        # properties = list(parameters_single_char.keys())
        # print(compact_card)

        # typical empty postion
        if compact_card == "****":
            return None

        for property_index, value in enumerate(compact_card):
            # print(property_index)
            # print(value)
            # print(parameters.keys())
            property = list(parameters.keys())[property_index]
            # print(parameters[property])
            
            try:
                value_index = parameters_single_char[property].index(value)
            except Exception as e:
                print(
                    "error when trying to parse: .:{}".format(e)
                    )
                print (compact_card)
                raise


            # card[property] = parameters[property][value_index]
            card.append(parameters[property][value_index])
        card = tuple(card)
        return card

    def restore_archived_pattern(self, pattern_dict):
        # pattern_dict --> contains "pattern" key with compacted pattern value. e.g. ['2RoP', '2RsP', '2GoS', '2RhP', '1RhD', '2RsD', '2GoD', '2GoP', '3RoS', '1RsD', '3BhD', '3BsS', '1BoP', '2RsS', '2BoP', '3RoP', '2GhP', '1RoD', '3BoD', '1RhP', '1RsP', '1BoD', '2BoS', '2BhS', '2GhS', '3RhD', '1RoP', '1GoS', '3GsP', '2BsD', '3RsS', '2GhD', '1RoS', '3BsD', '1BsD', '3GoP', '1BhS', '3BoP', '1RhS', '2BsS', '2GsS', '1GhS', '2BsP', '2BoD', '2GsD', '1GsP', '3GhS', '2RhD', '1GsD', '1GoP', '2BhP', '1GhD', '1BoS', '3GsD', '1GsS', '3GoD', '1GhP', '2BhD', '3GhP', '2GsP', '2RoS', '3GsS', '3GoS', '1BsS', '3BoS', '1GoD', '1RsS', '3GhD', '2RhS', '1BhD', '3RoD', '1BhP', '2RoD', '1BsP', '3BhS', '3RsD', '3RhS', '3RhP', '3BhP', '3BsP', '3RsP']
        self.reset_pattern()
        compact_pattern = pattern_dict["pattern"]
        self.load_from_compact_pattern(compact_pattern)
        self.calculate_all_pattern_stats()
        self.swap_positions_to_try = self.get_swap_positions_to_try_from_already_tried_positions(pattern_dict ["tried_position_swaps"] )
              
        # self.print_pattern()

    def get_pattern_as_dict(self):
        
        pattern_compact = self.get_pattern_compact(False, True, True, True)
        
        return {
            "pattern": pattern_compact,
            "window_stats": self.sets_count_window_distribution,
            "tried_position_swaps": self.get_already_tried_positions_from_swap_positions_to_try(self.swap_positions_to_try),
            "pattern_weight": self.total_pattern_weight
        }
    def get_all_basic_pattern_positions(self):
        return [(row, col) for row in range(PATTERN_ROWS) for col in range(PATTERN_COLS)]

    def create_full_pattern(self):
        # reset and fill full pattern.
        self.reset_pattern()
        positions = self.get_all_basic_pattern_positions()
        for pos in positions:
            self.add_card_to_pattern(None, pos)

    def load_from_compact_pattern(self, compact_pattern):
        if type(compact_pattern) is str:
            compact_pattern = json.loads(compact_pattern)
            
        self.reset_pattern()
        positions = self.get_all_basic_pattern_positions()
        for card_str, position in zip(compact_pattern, positions):
            # print("origin card string and position: {} , {}".format(card_str,position))
            card_tuple = self.card_compact_to_normal(card_str)
            self.add_card_to_pattern(card_tuple, position)

    def print_pattern_tags(self):
        print(self.get_pattern_values_as_string(self.pattern_tagged_positions))

    def get_all_window_weight_at_pattern_position(self, position):
        # get one pattern position value
        return self.pattern_tagged_positions[position]

    def get_all_window_weights(self):
        # all pattern positions and their values
        return {k: v for k, v in self.pattern_tagged_positions.items() if k in self.basic_pattern_positions}

    def add_to_all_window_weight_for_pattern_position(self, position, add_value):
        # add value to pattern position
        initial_row = position[0]
        initial_col = position[1]

        extended_col = initial_col
        extended_row = initial_row
        if (initial_col < PATTERN_COLS):
            extended_col += PATTERN_COLS
        else:
            extended_col -= PATTERN_COLS

        if (initial_row < PATTERN_ROWS):
            extended_row += PATTERN_ROWS
        else:
            extended_row -= PATTERN_ROWS

        self.pattern_tagged_positions[(initial_row, initial_col)] += add_value
        self.pattern_tagged_positions[(initial_row, extended_col)] += add_value
        self.pattern_tagged_positions[(extended_row, initial_col)] += add_value
        self.pattern_tagged_positions[(
            extended_row, extended_col)] += add_value

    def remove_card_from_pattern(self, position):
        initial_row = position[0]
        initial_col = position[1]

        extended_col = initial_col
        extended_row = initial_row
        if (initial_col < PATTERN_COLS):
            extended_col += PATTERN_COLS
        else:
            extended_col -= PATTERN_COLS

        if (initial_row < PATTERN_ROWS):
            extended_row += PATTERN_ROWS
        else:
            extended_row -= PATTERN_ROWS

        self.deck.append(self.pattern_extended[(initial_row, initial_col)])

        self.pattern_extended[(initial_row, initial_col)] = None
        self.pattern_extended[(initial_row, extended_col)] = None
        self.pattern_extended[(extended_row, initial_col)] = None
        self.pattern_extended[(extended_row, extended_col)] = None

    def add_card_to_pattern(self, card, position):
        if card is None:
            card = self.deck.pop(random.randrange(len(self.deck)))
        else:
            self.deck.remove(card)

        initial_row = position[0]
        initial_col = position[1]

        extended_col = initial_col
        extended_row = initial_row
        if (initial_col < PATTERN_COLS):
            extended_col += PATTERN_COLS
        else:
            extended_col -= PATTERN_COLS

        if (initial_row < PATTERN_ROWS):
            extended_row += PATTERN_ROWS
        else:
            extended_row -= PATTERN_ROWS

        self.pattern_extended[(initial_row, initial_col)] = card
        self.pattern_extended[(initial_row, extended_col)] = card
        self.pattern_extended[(extended_row, initial_col)] = card
        self.pattern_extended[(extended_row, extended_col)] = card

    def get_card_from_pattern(self, position):
        return self.pattern_extended[position]

    def get_pattern_compact(self, extended=False, compacted=True, as_list=True, as_JSON_string=False):
        # if extended:
        #     AssertionError, "not implemented"
        return_pattern = {}
        for row in range(PATTERN_ROWS + extended * PATTERN_ROWS):
            for col in range(PATTERN_COLS + extended * PATTERN_COLS):
                return_pattern[(row, col)] = self.pattern_extended[(row, col)]

        compacted_dict = {}
        if compacted:
            for k, v in return_pattern.items():
                if v is None:
                    compacted_dict[k] = "****"
                else:
                    # take first char from each value
                    compacted_dict[k] = "".join(item[0] for item in v)
            return_pattern = compacted_dict

        pattern_as_list = []
        if as_list:
            for row in range(PATTERN_ROWS + extended * PATTERN_ROWS):
                for col in range(PATTERN_COLS + extended * PATTERN_COLS):
                    val = return_pattern[(row, col)]
                    pattern_as_list.append(val)
            return_pattern = pattern_as_list

        if as_JSON_string:
            return_pattern = json.dumps(return_pattern)

        return return_pattern

    def get_pattern_as_string(self, print_extended=False):
        pattern_str = ""
        for row in range(PATTERN_ROWS + print_extended * PATTERN_ROWS):
            line_string = ""
            for col in range(PATTERN_COLS + print_extended * PATTERN_COLS):
                card_tuple = self.pattern_extended[(row, col)]
                if card_tuple is None:
                    card_tuple_short = "xxxx"
                else:
                    card_tuple_short = [t[:1] for t in card_tuple]

                card_string = ""
                for element in card_tuple_short:
                    card_string += element

                line_string += "{:<8}".format(str(card_string))

            pattern_str += line_string + "\n"
        return pattern_str

    def print_pattern(self, print_extended=False):
        print(self.get_pattern_as_string(print_extended))

    def get_pattern_positions_from_window_position(self, window_position):
        return [(window_position[0] + row, window_position[1] + col) for row in range(PATTERN_WINDOW_ROWS) for col in range(PATTERN_WINDOW_COLS)]

    def get_cards_from_basic_pattern(self):
        cards = []
        for pos in self.get_all_basic_pattern_positions():
            cards.append(self.get_card_from_pattern(pos))
        return cards

    def get_window_cards_from_pattern(self, window_position):
        positions = self.get_pattern_positions_from_window_position(
            window_position)
        # print("feijiejf{}".format(positions))
        cards = []
        for position in positions:
            cards.append(self.get_card_from_pattern(position))
        return cards

    def get_set_count_in_window(self, window_position):
        cards = self.get_window_cards_from_pattern(window_position)
        sets_count = set_in_cards(cards, False, True, False)
        return sets_count

    def calculate_all_pattern_stats(self, recalculate_set_count_per_window=True, recalculate_sets_window_distribution=True):
        if recalculate_set_count_per_window:
            # calculate amounts of sets per window
            window_positions = self.get_all_basic_pattern_positions()
            for position in window_positions:
                self.set_counts_pattern[position] = self.get_set_count_in_window(
                    position)
                

        if recalculate_sets_window_distribution:
            # calculate the distribution of set counts per window
            self.calculate_pattern_weight_and_sets_distribution()
            
        # calculate the total weight of the pattern (=score to understand how far away from our target we are (amount of sets per window))
        # self.calculate_full_pattern_weight()

    def calculate_pattern_weight_and_sets_distribution(self):
        # set count distribution for all windows.
        # sets_count = 0
        sets_count_window_distribution = [0 for i in range(20)]
        self.total_pattern_weight = 0
        

        for row in range(PATTERN_ROWS):
            for col in range(PATTERN_COLS):
                set_count = self.set_counts_pattern[(row, col)]
                # sets_count += set_count
                sets_count_window_distribution[set_count] += 1
                self.total_pattern_weight += self.get_weight_from_window_set_count(set_count)

        
        check_count = 0
        for i, count in enumerate(sets_count_window_distribution):
            check_count += i*count

        self.sets_count_window_distribution = sets_count_window_distribution

    # def get_weight_from_window_set_count(self, set_count):
    #     # amount of sets in a window defines it weight
    #     # for ZERO set PER WINDOW!!!
        
    #      # zero set windows get a punish point.
    #     # one set windows: no punish points
    #     # two  set windows: two punish points
    #     # ...
        
    #     if set_count == 0:
    #         return 0
    #     else:
    #         return set_count 
    # def get_weight_from_window_set_count(self, set_count):
    #     # amount of sets in a window defines it weight
    #     # for TRIPLE set PER WINDOW!!!
        
    #      # zero set windows get a punish point.
    #     # one set windows: no punish points
    #     # two  set windows: two punish points
    #     # ...
        
    #     if set_count == 0:
    #         return 3
    #     if set_count == 1:
    #         return 2 
    #     if set_count == 2:
    #         return 1 
    #     elif set_count == 3:
    #         # add zero
    #         return 0
    #     else:
    #         return set_count - 3
    # def get_weight_from_window_set_count(self, set_count):
    #     # amount of sets in a window defines it weight
    #     # FOR double set PER WINDOW!!!
        
    #      # zero set windows get a punish point.
    #     # one set windows: no punish points
    #     # two  set windows: two punish points
    #     # ...
        
    #     if set_count == 0:
    #         return 2
    #     if set_count == 1:
    #         return 1 
    #     elif set_count == 2:
    #         # add zero
    #         return 0
    #     else:
    #         return set_count - 2
    def get_weight_from_window_set_count(self, set_count):
        # amount of sets in a window defines it weight
        
         # zero set windows get a punish point.
        # one set windows: no punish points
        # two  set windows: two punish points
        # ...
        
        if set_count == 0:
            return 1 
        elif set_count == 1:
            # add zero
            return 0
        else:
            return set_count - 1

    def get_pattern_values_as_string(self, pattern_values):
        values_str = ""
        for row in range(PATTERN_ROWS):
            line_string = ""
            for col in range(PATTERN_COLS):
                val = pattern_values[(row, col)]
                line_string += "{:<4}".format(val)
            values_str += line_string + "\n"
        return (values_str)

    def print_pattern_stats(self):
        print(self.get_pattern_compact())
        print(self.get_pattern_values_as_string(self.set_counts_pattern))
        print("Total sets: {}" .format(self.get_pattern_total_sets_count()))
        print("Sets per window distribution: {}" .format(
            self.sets_count_window_distribution))

        print("Pattern weigth = {} ".format(self.total_pattern_weight))
        

    def get_pattern_total_sets_count(self):
        return sum([i*v for i, v in enumerate(self.sets_count_window_distribution)])

    def save_pattern_to_file(self, base_path):
        base_path = Path(base_path)
        single_set_windows = self.sets_count_window_distribution[1]

        get_pattern_total_sets_count = get_pattern_total_sets_count()

        name = "SET_pattern_{}_{}_{}.txt".format(str(single_set_windows), str(
            get_pattern_total_sets_count), str(self.sets_count_window_distribution))

        with open(Path(base_path, name), 'w') as file:
            pattern_string = self.get_pattern_as_string()
            file.write(f"{pattern_string}\n")
            sets_counts_windows_as_string = self.get_set_counts_pattern_as_string()
            file.write(f"{sets_counts_windows_as_string}\n")

    def start_search_all_windows_single_set(self, compact_pattern=None):
        success = False
        tried_position_swaps = []
        if compact_pattern is not None:
            self.load_from_compact_pattern(compact_pattern)
            success = True
            
        else:
            pattern_dict = self.db_set.get_pattern_with_best_weight_not_exhausted()
            
            if pattern_dict is not None:
                self.restore_archived_pattern(pattern_dict)
                self.print_pattern()
                self.print_pattern_stats()
                tried_position_swaps = pattern_dict["tried_position_swaps"]
                
                success = True
        
        if not success:   
            self.create_full_pattern()
            self.print_pattern()

        self.swap_positions_to_try = self.get_swap_positions_to_try_from_already_tried_positions(tried_position_swaps)
        # print(len(self.swap_positions_to_try))
        self.cyclic_swapping_single_set_improvement()

    def get_already_tried_positions_from_swap_positions_to_try(self, positions_to_try):
        # sorted by design!!!  If positions is sorted, the combinations are too. itertools.combinations generates combinations in lexicographic order based on the input iterable.
        positions = self.get_all_basic_pattern_positions()
        all_possible_swap_combinations = set(itertools.combinations(positions, 2)) 
        
        
        # make sure swap positions are sorted.
        # all_possible_swap_combinations = set([tuple(sorted(swap)) for swap in all_possible_swap_combinations ])
        # print(all_possible_swap_combinations)
        # exit()
        return list(all_possible_swap_combinations - set(positions_to_try))
        
    def get_swap_positions_to_try_from_already_tried_positions(self, already_tried_swap_positions):
        positions = self.get_all_basic_pattern_positions()
        all_possible_swap_combinations = set(itertools.combinations(positions, 2)) #3240 for swapping two cards in a full pattern
        return list(all_possible_swap_combinations - set(already_tried_swap_positions))
    
    def cyclic_swapping_single_set_improvement(self):
        swap_count = 0
        
        self.calculate_all_pattern_stats() 
        pattern_dict_before_swap_attempt = copy.deepcopy(self.get_pattern_as_dict())
        
        now_ms_epoch = int(time.time() * 1000)
        previous_time_stamp = now_ms_epoch

        INTERVAL_CHECK_CYCLE_COUNT = 1000

        recorded_set_counts_pattern = None
        pattern_compact = self.get_pattern_compact(
                extended=False, compacted=True, as_list=True, as_JSON_string=True)
        
        while True:
            # 3240: = number of possible swaps for 81 cards (81cards in pattern.  80 + 79 + ... + 1)
            if len(self.swap_positions_to_try) > 0:
                swap_count += 1
                
                # print(len(self.swap_positions_to_try))
                # swap_positions = self.get_swap_positions(self.swap_positions_to_try, position_weights)
                # print(len(self.swap_positions_to_try))
                
                # print(len(self.swap_positions_to_try))

                pattern_weigth_pre_swap, pattern_weigth_post_swap, is_swapped, recorded_set_counts_pattern = self.swap_improve_single_set_window(
                    self.swap_positions_to_try, recorded_set_counts_pattern)
                # self data after testing is ALWAYS as it was after the test! The pattern is already swapped back, but calcs are not redone. 
                
                # print("{} (swaps to go). ".format(len(self.swap_positions_to_try)))
                
                # pattern_dict_post_swap = self.get_pattern_as_dict()
                
            else:
                # exhausted attempts, no improvement possibilities for swapping. 
                
                # write to db to tag it. 
                # d = pattern_dict_before_swap_attempt
                # l = len(d["tried_position_swaps"] )
                # d["tried_position_swaps"] = self.get_already_tried_positions_from_swap_positions_to_try(self.swap_positions_to_try)
                # tried = d["window_stats"]
                # pattern_dict_before_swap_attempt["tried_position_swaps"]
                pattern_dict_before_swap_attempt["tried_position_swaps"] = self.get_already_tried_positions_from_swap_positions_to_try(self.swap_positions_to_try)
                self.db_set.add_pattern(pattern_dict_before_swap_attempt)  
                # print("dijeijjfijj added partterne . length pos tried: {}, windwo: {}".format(l, tried))
                # change pattern
                success = False
                while not success:
                    try:
                        pattern_dict = self.db_set.get_pattern_with_best_weight_not_exhausted()
                        if pattern_dict is None:
                            raise Exception("All possibilities in this database are exhausted. ")
                            
                       
                        self.restore_archived_pattern(pattern_dict)  # resets pattern 
                        self.swap_positions_to_try = self.get_swap_positions_to_try_from_already_tried_positions(pattern_dict ["tried_position_swaps"] )
                        pattern_dict_before_swap_attempt = self.get_pattern_as_dict()
                        success = True
                        
                    except Exception as e:
                        print("error when loading new pattern.  {}".format(e))
                        exit()
                        # most probably 
                        
                        # print(pattern_compact)
               
                        
                recorded_set_counts_pattern = None
                

            if swap_count % INTERVAL_CHECK_CYCLE_COUNT == 0:
                now_ms_epoch = int(time.time() * 1000)
                dt = now_ms_epoch - previous_time_stamp
                swaps_per_second = (INTERVAL_CHECK_CYCLE_COUNT / dt * 1000)
                previous_time_stamp = now_ms_epoch

                print("Swap Cycle {}. Swaps per second: {:.3f} . pattern weight: {}. (window set count buffer length: {} set count buffer hits - nohits = {} - {})".format(
                    swap_count, swaps_per_second, pattern_weigth_pre_swap, len(window_set_count_buffer), 
                    window_set_count_buffer_hits,
                    window_set_count_buffer_non_hits,
                    )
                      )
              
            if (is_swapped and pattern_dict_before_swap_attempt["pattern_weight"] != self.total_pattern_weight):
                
                # first update current pattern to db.
                pattern_dict_before_swap_attempt["tried_position_swaps"] = self.get_already_tried_positions_from_swap_positions_to_try(self.swap_positions_to_try)
                self.db_set.add_pattern(pattern_dict_before_swap_attempt)
                
                # do check if exists already:pattern_compact = self.get_pattern_compact(False, True, True, True)
                new_pattern_from_db_dict = self.db_set.get_pattern_data(self.get_pattern_compact(False, True, True, True))
                
                if new_pattern_from_db_dict is not None and len(new_pattern_from_db_dict["tried_position_swaps"]) >= 3240:
                    # this is an exhaused pattern (everything tried and failed to imporove weight). And it should be omitted.
                    # print("NOT SWAPPED. pattern exists in db and is already tested without results. {}" .format(new_pattern_from_db_dict["window_stats"]))

                    self.restore_archived_pattern(pattern_dict_before_swap_attempt)
                    # self.swap_positions_to_try = self.get_swap_positions_to_try_from_already_tried_positions(pattern_dict_before_swap_attempt ["tried_position_swaps"] )
                    
                    # print("rstoredsd: . {}" .format(pattern_dict_before_swap_attempt["window_stats"]))
                    
                else:
                    if (self.total_pattern_weight < 100):
                        print("--------SET PATTERN STATS after {} cycles:-----------".format(swap_count))
                        self.print_pattern()
                        print("swapped. New weight is: {}, old weight was {}".format(
                            pattern_weigth_post_swap, pattern_weigth_pre_swap))

                        # print ("total one set per window score (0= all windows one set): {}".format(pattern_weigth))
                        # self.calculate_all_pattern_stats()
                        self.print_pattern_stats()
                    
                    print("Set pattern improved: weight: {}".format(pattern_weigth_post_swap))
                    self.db_set.add_pattern(self.get_pattern_as_dict())  # todo: limit db writes. by bundling...
                    pattern_dict_before_swap_attempt = copy.deepcopy(self.get_pattern_as_dict())
            # deep copy of the pattern data
            # pattern_dict_previous_swap = copy.deepcopy(pattern_dict_post_swap)
                
    def swap_improve_single_set_window(self, available_swap_combinations, buffered_set_counts_pattern=None ):
        # improve the amount of single set windows by swapping cards and analysing.

        # 1. analyse
        # 2. select swap positions. and swap cards a random from most non matching window
        # 2. swap
        # 3. analyse again
        # 4. if situation improved--> safe. If not, undo.

        if buffered_set_counts_pattern is not None:
            self.set_counts_pattern = buffered_set_counts_pattern.copy()
            self.calculate_all_pattern_stats(False) # saves heaps of time (not recalculate every set count per window)
        else:
            pass
            self.calculate_all_pattern_stats()

        pre_swap_set_counts_pattern = self.set_counts_pattern.copy()
        pre_swap_pattern_weight = self.total_pattern_weight

    
    
        CHOOSE_SWAP_BY_WEIGHT = False
        
        if CHOOSE_SWAP_BY_WEIGHT:
            # assigning card position weights
            for position in self.basic_pattern_positions:
                set_count_in_window = self.set_counts_pattern[position]
                window_positions = self.get_pattern_positions_from_window_position(
                    position)
                for wp in window_positions:
                    self.add_to_all_window_weight_for_pattern_position(wp, self.get_weight_from_window_set_count(set_count_in_window))
            
                    # swap_positions = self.get_swap_positions(self.swap_positions_to_try, self.get_all_window_weights())
            
            # every swap position get a weight, combined swap window weights 
            
            
            weighted_swap_positions_to_try_dict = {
                (pos1,pos2):self.get_all_window_weight_at_pattern_position(pos1) + self.get_all_window_weight_at_pattern_position(pos2)
                for pos1,pos2 in available_swap_combinations
                } 
            
            
            swap, value = max(weighted_swap_positions_to_try_dict.items(), key=lambda item: item[1])
        else:
            swap = random.choice(available_swap_combinations)
        #print (value)
            
        swap_pos_1, swap_pos_2 = swap
        
        available_swap_combinations.remove(swap)
        
        
        # print(swap_pos_1)
        # print(swap_pos_2)
        # print("00000000000000 {}".format(value))
        # self.print_pattern_stats()
        
        # # Get the keys of the 10 items with the lowest values
        # keys_to_keep = sorted(available_swap_combinations, key=available_swap_combinations.get)[100:]
        # Get the keys of the 10 items with the highest values
        # keys_to_keep = sorted(weighted_swap_positions_to_try_dict, key=weighted_swap_positions_to_try_dict.get, reverse=True)[10:]
        # # available_swap_combinations = {key: available_swap_combinations[key] for key in keys_to_keep}
        
        
        # for swap_position in available_swap_combinations:
        #     if swap_position not in keys_to_keep:
        #         available_swap_combinations.remove(swap_position)
        # # exit()
        # exit()
        
            # swap_positions = random.choice(swap_positions_to_try)  # Pick a random element
            # swap_positions_to_try.remove(swap_positions)
    
        
            # get highest score positions
            # AMOUNT_OF_SWAPPABLE_POSITIONS = 81 # best pattern_weight of about 23
            # AMOUNT_OF_SWAPPABLE_POSITIONS = 15 # best pattern_weight of about 23
            # AMOUNT_OF_SWAPPABLE_POSITIONS = 20 # best pattern weight of about 15
            # AMOUNT_OF_SWAPPABLE_POSITIONS = 20 #  weight 26 after 2500 cycles (multplier power = 1)  multiplier=2 : weight23 (at 2500 cycles)
            # weight 26 after 2500 cycles (multplier power = 1), multiplier=2 : weight21 (at 2500 cycles), multiplier=3 : weight25 (at 2500 cycles) weight 13 after 5000 cycles,

            # AMOUNT_OF_SWAPPABLE_POSITIONS = 81

            # tagged_position_basic_pattern = self.get_all_window_weights()
            
            # by weight.
            # swappable_positions = [k for k, v in sorted(tagged_position_basic_pattern.items(
            # ), key=lambda item: (item[1], random.random()), reverse=True)[:AMOUNT_OF_SWAPPABLE_POSITIONS]]
            # # print(swappable_positions)

            # print(values_of_swappable_positions)
            # select swap positions: unweighted.
            # swap_pos_1 = swappable_positions.pop(random.randint(0, len(swappable_positions) - 1))
            # swap_pos_2 = swappable_positions.pop(random.randint(0, len(swappable_positions) - 1))

            # select swap positions: weighted.
            # then higher the weight, the more probability to be picked. The multiplier enforces these probabilities
            
            # PROBABILITY_POWER = 4  # higher: faster weight optimizing at start, but then stops quickly.
            # values_of_swappable_positions = [
            #     tagged_position_basic_pattern[p] ^ PROBABILITY_POWER for p in swappable_positions]

            # swap_positions_chosen = False
            # attempts = 100
            # while not swap_positions_chosen:
            #     swap_pos_1_index = random.choices(
            #         range(len(swappable_positions)), weights=values_of_swappable_positions, k=1)[0]
            #     swap_pos_2_index = swap_pos_1_index
            #     while swap_pos_2_index == swap_pos_1_index:
            #         swap_pos_2_index = random.choices(
            #             range(len(swappable_positions)), weights=values_of_swappable_positions, k=1)[0]

            #     swap_pos_1 = swappable_positions[swap_pos_1_index]
            #     swap_pos_2 = swappable_positions[swap_pos_2_index]



                # sorted to unify.
                # swapped_positions = sorted((swap_pos_1, swap_pos_2))

        
        
                # if swapped_positions in available_swap_combinations:
                #     swap_positions_chosen = True
                #     attempts -= 1
                #     if attempts <= 0:
                #         print("all swap positions have been tried before without success. {} ".format(
                #             previously_failed_swapped_positions_for_this_pattern))
                #         raise
                # else:
                #     # position tested before. Try another one. 
                    
                #     # if len(previously_failed_swapped_positions_for_this_pattern) > 3238:
                #     #     print("Nearing the end of the 3240 possible card swaps per pattern... ")
                #     #     print("repeat swap position, will not redo. amount of previous swap positions: {} ".format(len(previously_failed_swapped_positions_for_this_pattern)))
                #     pass
        # else:
        #     # take swap positions from available positions list :
            
        #     if previously_failed_swapped_positions_for_this_pattern is None:
        #         # no buffer to check if swapped position has been tested before.
        #         swap_positions_chosen = True
            
        #     else:
        #         if swapped_positions not in previously_failed_swapped_positions_for_this_pattern:
        #             swap_positions_chosen = True
        #             attempts -= 1
        #             if attempts <= 0:
        #                 print("all swap positions have been tried before without success. {} ".format(
        #                     previously_failed_swapped_positions_for_this_pattern))
        #                 raise
        #         else:
        #             # position tested before. Try another one. 
                    
        #             # if len(previously_failed_swapped_positions_for_this_pattern) > 3238:
        #             #     print("Nearing the end of the 3240 possible card swaps per pattern... ")
        #             #     print("repeat swap position, will not redo. amount of previous swap positions: {} ".format(len(previously_failed_swapped_positions_for_this_pattern)))
        #             pass
        
        
        
        
        
        
        
        
        
        
        
        
        
        # swap_pos_1, swap_pos_2 = swap_positions

        # do the swap
        orig_card_pos_1 = self.get_card_from_pattern(swap_pos_1)
        orig_card_pos_2 = self.get_card_from_pattern(swap_pos_2)
        self.remove_card_from_pattern(swap_pos_1)
        self.remove_card_from_pattern(swap_pos_2)
        self.add_card_to_pattern(orig_card_pos_2, swap_pos_1)
        self.add_card_to_pattern(orig_card_pos_1, swap_pos_2)

        # do analysis again
        self.calculate_all_pattern_stats()
        post_swap_set_counts_pattern = self.set_counts_pattern.copy()
        post_swap_pattern_weight = self.total_pattern_weight
        
        # print("positions left: {}   pre weight :{}, post weight: {} ".format(len(available_swap_combinations), pre_swap_pattern_weight, post_swap_pattern_weight))
        
        # todo > or >=  (Lode thinks > )
        if post_swap_pattern_weight > pre_swap_pattern_weight:
            # print("Post bigger score than pre. ---> succes false.")
            # undo if the weight didn't improve
            self.remove_card_from_pattern(swap_pos_1)
            self.remove_card_from_pattern(swap_pos_2)
            self.add_card_to_pattern(orig_card_pos_1, swap_pos_1)
            self.add_card_to_pattern(orig_card_pos_2, swap_pos_2)
            
            return pre_swap_pattern_weight, post_swap_pattern_weight, False, pre_swap_set_counts_pattern

        else:
            # if weight is equal, be ok with the changes. Prevents from being stuck in a situation for too long?! OK or not ?!
            return pre_swap_pattern_weight, post_swap_pattern_weight, True, post_swap_set_counts_pattern

    def start_recursive_single_set_window_pattern_search(self):
        # DEPRECATED

        # 1 create start situation
        #   - get window. fill up
        #             if one set: next position
        #             - if not one set, take away the recent cards and try again with another card from the deck
        #   -                 - if all options are exhausted: go up one level and try again.
        # if all position full: END condition
        self.reset_pattern()
        window_index = 0    # go over all positions. #self.basic_pattern_positions()

        success = self.recursive_single_set_window_pattern_search(window_index)
        if success:
            print("SEARCH FINISHED successfully")

            self.calculate_all_pattern_stats()
            self.print_pattern_stats()
        else:
            print("SEARCH FINISHED. No pattern found....")

        self.print_pattern()

        # fill in missing cards
    def recursive_single_set_window_pattern_search(self, window_index):
        # DEPRECATED
        # print("--------next level---------{}".format(window_index))
        if window_index >= 81:
            self.print_pattern()
            return True

        # sanity check:

        # free_spots_count = sum(card is None for card in self.get_cards_from_basic_pattern())
        # if (81-index) != free_spots_count:
        #     self.print_pattern()
        #     print("assert error. there should be equally cards  as the recursion level. ")
        #     raise

        window_position = self.basic_pattern_positions[window_index]
        positions_in_window = self.get_pattern_positions_from_window_position(
            window_position)

        # check which positions have no cards in the window
        empty_positions_in_window = []
        for pos in positions_in_window:
            if self.pattern_extended[pos] is None:
                empty_positions_in_window.append(pos)

        attempts = 11
        # self.print_pattern()
        while attempts > 0:
            self.i += 1
            if self.i % 10000 == 0:
                self.print_pattern()

                if (window_index > 10):
                    self.add_current_situation_to_db()
                self.calculate_all_pattern_stats()
                self.print_pattern_stats()
                print("iteration {}, level: {}".format(self.i, window_index))

                # raise
            # print("attempt{}".format(attempts))

            # fill up window with random cards from deck
            for ep in empty_positions_in_window:
                self.add_card_to_pattern(None, ep)

            # print("filled up pattern")
            # self.print_pattern()

            # check if there is exactly one SET in window
            set_count = self.get_set_count_in_window(window_position)
            # if set_count <= 4:
            if set_count == 1:
                # conditions met, go to next level
                is_finished = self.recursive_single_set_window_pattern_search(
                    window_index + 1)
                if is_finished:
                    # return success!!
                    return True
                attempts -= 1

            else:
                # if there are no spots to fill in, return right away
                if len(empty_positions_in_window) == 0:
                    return False

                attempts -= 1

            # undo situation
            for ep in empty_positions_in_window:
                self.remove_card_from_pattern(ep)

        # no success
        return False

    # def tag_multiset_window_cards(self):

    #     pattern_positions = self.get_all_basic_pattern_positions()

    #     # window_positions = self.get_all_basic_pattern_positions()
    #     # SCAN 1: tag cards to REMAIN if only one set in a particular window.

    #     for position in pattern_positions:
    #         set_count_in_window = self.set_counts_pattern[position]
    #         print("{}: set count: {}".format(position, set_count_in_window))
    #         if set_count_in_window != 1:
    #             row,col = position
    #             window_top_right_position = (row, col + 3)
    #             self.add_to_all_window_weight_for_pattern_position(window_top_right_position, True)
    #             # window_positions = self.get_pattern_positions_from_window_position(position)
    #             # for wp in window_positions:
    #             #     self.add_to_all_window_weight_for_pattern_position(wp, True)

    #         # else:

    # def tag_multiset_window_cards(self):
        # MISERABLE FAILED THEORY. Basically: almost all positions tagged as "preserve", while they shouldn't....
    #     pattern_positions = self.get_all_basic_pattern_positions()

    #     # window_positions = self.get_all_basic_pattern_positions()
    #     # SCAN 1: tag cards to REMAIN if only one set in a particular window.

    #     for position in pattern_positions:
    #         set_count_in_window = self.set_counts_pattern[position]
    #         print("{}: set count: {}".format(position, set_count_in_window))
    #         if set_count_in_window == 1:

    #             window_positions = self.get_pattern_positions_from_window_position(position)
    #             for wp in window_positions:
    #                 self.add_to_all_window_weight_for_pattern_position(wp, True)


def generate_set_patterns_to_file():
    for i in range(1):
        setgame = SET()
        setgame.create_full_pattern()
        setgame.calculate_all_pattern_stats()
        setgame.print_pattern(False)
        setgame.print_pattern_stats()
        setgame.save_pattern_to_file(
            "C:\Data\generated_program_data\SET_pattern")


def generate_set_patterns_to_db(db_path, attempts=100):

    db_set = db_SET_analytics(db_path)

    for i in range(attempts):
        setgame = SET()
        setgame.create_full_pattern()
        setgame.calculate_all_pattern_stats()
        # setgame.print_pattern(False)
        # print(setgame.pattern_extended)
        # setgame.print_pattern_stats()
        # window_positions = setgame.get_pattern_positions_from_window_position((0,0))
        onepattern_dict = setgame.get_pattern_as_dict()

        db_set.add_pattern(onepattern_dict)


def retrieve_most_promising_pattern(db_path):
    db_set = db_SET_analytics(db_path)
    pattern_dict = db_set.get_pattern_with_most_single_set_windows()
    setgame = SET()
    print(pattern_dict)
    setgame.restore_archived_pattern(pattern_dict)
    setgame.print_pattern()
    setgame.calculate_all_pattern_stats()
    setgame.print_pattern_stats()

# def improve_single_set_windows(setgame):
#     # setgame = SET()

#     i = 0
#     pattern_weigth_pre_swap = 99999999
#     pattern_weigth_post_swap = pattern_weigth_pre_swap

#     while True:
#         i+=1
#         pattern_weigth_pre_swap, pattern_weigth_post_swap, is_swapped  = setgame.swap_improve_single_set_window()
#         if i%1000 == 0:
#             print ("----------------------Swap Cycle {}".format(i))
#         if is_swapped and pattern_weigth_pre_swap != pattern_weigth_post_swap:
#         # if i%100 == 0:
#             print ("--------SET PATTERN STATS after {} cycles:-----------".format(i))
#             setgame.print_pattern()
#             print("swapped. New weight is: {}, old weight was {}".format(pattern_weigth_post_swap, pattern_weigth_pre_swap))

#             # print ("total one set per window score (0= all windows one set): {}".format(pattern_weigth))
#             setgame.calculate_all_pattern_stats(True)
#             setgame.print_pattern_stats()


def get_best_weighted_set_from_db(db_path):
    set_db = db_SET_analytics(db_path)
    setgame = SET()
    
    pattern_dict = set_db.get_pattern_with_best_weight_not_exhausted()
    if pattern_dict is None:
        raise "no pattern dict returned."
    
    else:
        pattern_compact = pattern_dict["pattern"]
        setgame.load_from_compact_pattern(pattern_compact)  # resets pattern 
                        
        setgame.print_pattern()
        setgame.calculate_all_pattern_stats()
        setgame.print_pattern_stats()
        
def test():
    setgame = SET()
    positions = setgame.get_all_basic_pattern_positions()
    pairs = list(itertools.combinations(positions, 2))
    print(pairs)
    if ((0,0),(0,8)) in pairs:
        print("feije")
    
if __name__ == "__main__":
    
    single_set_pattern_weight_5 = ["2GoP", "3BoS", "2BhS", "1RhS", "1GoP", "1BhD", "1BoS", "1BsD", "1GoD", "2BoD", "1BhP", "3GhD", "1BsP", "3BhS", "3RsS", "2BoS", "2GoD", "3RsD", "3GoS", "3RoP", "1BoD", "3GhS", "2BsS", "3RoS", "3BoD", "2GhD", "2RhD", "3GsP", "2BsD", "3GoP", "1GhD", "1GsD", "3BhP", "3GhP", "2RhS", "1RhD", "2GhS", "1RsP", "1GsS", "1GhP", "2RoP", "2BhD", "2BsP", "1RhP", "1RoD", "1RoS", "3BsD", "3RhP", "1RoP", "2GsD", "1RsS", "3BhD", "2RoS", "1GhS", "3GsD", "2RsS", "3RsP", "3BoP", "3RoD", "1GoS", "2GhP", "1BoP", "2GoS", "1BhS", "2GsS", "2BhP", "3GoD", "3GsS", "1RsD", "2RoD", "1BsS", "2GsP", "3BsP", "3RhD", "2BoP", "1GsP", "3BsS", "2RsP", "3RhS", "2RsD", "2RhP"]
    single_set_pattern_weight_2 = ["3RoP", "2BsP", "3GsS", "3RoS", "3GhS", "1GhP", "3BsP", "2BsS", "2GhS", "1RsS", "1RoS", "2BhD", "3RhS", "2GsD", "1RsD", "2BoS", "2BoP", "3BsD", "2RhS", "1GoD", "3GhP", "2GoP", "2RhD", "3GoP", "1RsP", "1RhP", "3BhD", "2BoD", "3GsD", "1GsS", "1GsD", "3RhD", "3GhD", "3GoS", "2GhD", "2RoS", "1GhS", "2RoP", "1BoD", "2RoD", "1BhP", "3RoD", "2BhP", "1RoD", "1GoP", "1BsD", "2BhS", "1BsP", "3RhP", "1GhD", "1BoP", "1BhS", "3GoD", "1BhD", "2GoS", "2BsD", "2RsD", "3BhS", "3RsD", "2RsP", "2RhP", "3BsS", "2GsS", "3BoS", "1RoP", "1RhS", "3BhP", "2GoD", "1GoS", "3BoD", "1GsP", "3RsS", "1BoS", "3GsP", "3BoP", "3RsP", "2GsP", "1RhD", "1BsS", "2GhP", "2RsS"]
    single_set_pattern_weight_7 = ["1GhS", "3GsS", "3GoD", "1RoD", "1BsD", "1BsS", "1RsP", "1RhP", "2RoD", "1RsS", "1RsD", "2GhD", "3RhD", "3BoP", "2BsP", "2RhP", "3GhD", "1GsP", "3GsD", "1BoD", "3RsS", "2GoS", "3GoP", "3BsP", "3RsD", "2GsD", "2RoS", "2GhS", "3GhS", "2BoD", "3GhP", "2RsS", "2RhD", "3BhD", "3GoS", "3RhP", "2RsD", "2BhP", "3RoD", "2GsP", "2GsS", "3BsS", "1GoS", "2GoP", "3BhS", "2GhP", "1GhP", "2GoD", "2BhS", "3GsP", "2BhD", "1RoP", "2BsD", "1BoS", "1BhP", "1GhD", "3BoS", "3RoS", "1RhS", "1GoP", "2BoS", "2RsP", "1BhS", "1BsP", "3BoD", "1GsD", "3BsD", "1BhD", "1RoS", "2RoP", "2RhS", "1BoP", "1RhD", "3RoP", "1GoD", "3RhS", "1GsS", "3BhP", "2BsS", "2BoP", "3RsP"]
    single_set_pattern_weight_8 = ["2GoP", "3BhS", "1GhD", "3RsD", "3GoD", "2RsD", "1GoS", "2RoS", "3RoD", "2RsS", "2GoS", "2GoD", "2GhD", "3RsS", "3RhD", "2BoP", "2BhP", "1BhD", "2GhS", "1GsD", "3BsD", "2BsS", "3RoS", "2RhD", "1BoD", "1BoP", "1GhP", "3GsP", "1BsD", "3GhS", "1RsS", "1BhS", "2GsP", "1RhD", "1GoP", "2RhS", "1RhP", "1GoD", "2GhP", "3GsD", "3GhD", "3GoS", "3BoP", "2BoD", "2BsD", "1GsP", "1RsD", "3BsP", "3RhP", "2RhP", "3GsS", "1RsP", "2RoD", "3BhD", "3BsS", "3RoP", "2BhD", "1BhP", "1RhS", "2GsD", "2BhS", "1GsS", "2BoS", "3RsP", "3RhS", "3BhP", "3BoS", "1RoP", "2BsP", "1RoS", "2RsP", "3BoD", "1BsS", "1RoD", "2RoP", "1BoS", "1GhS", "3GoP", "1BsP", "2GsS", "3GhP"]
    
    db_path = "E:\set_patterns_{}.db".format(random.randint(1,10000))
    # db_path = "C:\Data\generated_program_data\SET_pattern_searcher\set_patterns_{}.db".format(random.randint(1,10000))
    
    # db_path = "C:\Data\generated_program_data\SET_pattern_searcher\set_patterns_367.db"
    
    # get_best_weighted_set_from_db(db_path)
    # exit()
    
    # setgame = SET()
    # setgame.setup_db(db_path)
    # # setgame.create_full_pattern()
    # setgame.load_from_compact_pattern(single_set_pattern_weight_5)
    # setgame.add_current_situation_to_db()
    # exit()
    # [(2, 7), (8, 5)]
    # [(5, 3), (6, 1)]
    # [(0, 5), (8, 0)]
    # [(2, 5), (5, 8)]
    setgame = SET()
    setgame.setup_db(db_path)
    setgame.start_search_all_windows_single_set( )
    
    
        # self.load_from_compact_pattern(pattern_compact)  # resets pattern
    # ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  # File "E:\Lode GIT\hyperlode.github.io\Set-game-trainer\SET_pattern_generator.py", line 390, in load_from_compact_pattern
    # card_tuple = self.card_compact_to_normal(card_str)
                 # ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  # File "E:\Lode GIT\hyperlode.github.io\Set-game-trainer\SET_pattern_generator.py", line 344, in card_compact_to_normal
    # value_index = parameters_single_char[property].index(value)
    
    
    
    
    # setgame.setup_db(db_path)
    # setgame.start_recursive_single_set_window_pattern_search()

    # generate_set_patterns_to_db(db_path, attempts=100000)

    # retrieve_most_promising_pattern(db_path)

    # setgame = SET()
    # setgame.create_full_pattern()
    # setgame.print_pattern()
    # setgame.calculate_all_pattern_stats()
    # setgame.print_pattern_stats()
    # improve_single_set_windows(setgame)

    # setgame.print_pattern()
    # setgame.tag_multiset_window_cards()
    # setgame.print_pattern_tags()
