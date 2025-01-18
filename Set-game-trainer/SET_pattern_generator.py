# check set probabilities as cards are added. 

import itertools
import random
from pathlib import Path

import sqlite3
import json

# set pattern properties
PATTERN_ROWS = 9
PATTERN_COLS = 9
PATTERN_WINDOW_ROWS = 3
PATTERN_WINDOW_COLS = 4

# Set
#card options
PROPERTIES_COUNT = 3
VALUES_COUNT = 4
parameters = { "quantity":["1","2","3"],"colour":["Red", "Green", "Blue"], "infill":["open","hatched","solid"], "shape":["Squiggle","Pill","Diamond"]}
parameters_single_char = {"quantity":["1","2","3"], "colour":["R", "G", "B"], "infill":["o","h","s"], "shape":["S","P","D"]}

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
    
    #check for none cards:
    if None in three_cards:
        return False
    
    #bundle per property
    separated_per_property = list(zip(*three_cards))
    
    #check
    for p in separated_per_property:
        assert len(p)== PROPERTIES_COUNT, "Incorrect card "
    
    separated_per_property_as_different_values = [set(p) for p in separated_per_property]
    
    is_set = True
    # check for all values diff or all equal per parameter SET fulfillment requirement
    for diff_values in separated_per_property_as_different_values:
        diff_count = len(diff_values)
        if diff_count == 1 or diff_count == PROPERTIES_COUNT:
            pass
        else:
            is_set = False
    if verbose:
        print("SET") if is_set else print("No SET")

    # for card in three_cards:
    return is_set

def check_random_draw_from_full_deck(deck):
     
    random_cards = []
    for i in range(3):
        position = random.randint(0, len(deck)-1)
        card = deck[position]
        random_cards.append(card)
    print(*random_cards)
    is_set(random_cards)
    
def set_in_cards(cards, verbose=False, count_sets=False):
    if len(cards) < 3:
        return False
    
    # check if there is a set in cards
    combinations_of_three_cards = list(itertools.combinations(cards, 3))
    sets_count = 0
    for three_cards in combinations_of_three_cards:
        if verbose:
            print(three_cards)
        if is_set(three_cards, verbose=False):
            if verbose:
                print("SET FOUND")
                print(three_cards)
            sets_count+=1
        
        if not count_sets:
            return True
        
        
    if not count_sets:
        return False
    else:
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
            print(f"An error occurred, not saved to db. Program will continue.: {e}")
    
    
    def check_integrity(self):
        # Function to check if a table exists
        if not (self.table_exists("set_patterns")):
            # print("DB not OK. Uncomment next lines to create table. ")
            self.create_table_set_patterns()
        
    def add_pattern(self, set_pattern_dict):
        # Function to store a list in the database
        pattern = set_pattern_dict["pattern"]
        
        window_stats = set_pattern_dict["window_stats"]
        single_set_windows = window_stats[1]
        
        # Convert the list to JSON
        json_pattern = json.dumps(pattern)
        json_window_stats = json.dumps(window_stats)
        
        self.execute_sql(
            "INSERT INTO set_patterns (pattern, window_stats, single_set_windows) VALUES ('{}','{}','{}')".format(
                json_pattern, json_window_stats, single_set_windows
                ))
        
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
            single_set_windows INTEGER
        )
        """)
    
    def get_pattern_with_most_single_set_windows(self):
        self.cursor.execute(f"""
            SELECT * FROM set_patterns
            ORDER BY single_set_windows DESC
            LIMIT 1
            """)
        
        row = self.cursor.fetchone()
        pattern_json, window_stats_json, single_set_windows = row

        pattern = json.loads(pattern_json)
        window_stats_json = json.loads(window_stats_json)
        single_set_windows = int(single_set_windows)
        return {"pattern":pattern, "window_stats_json":window_stats_json, "single_set_windows":single_set_windows}

                              
class SET(): 
    
    def __init__(self):
       self.reset_pattern()
       
    def setup_db(self, db_path):
        self.db_set = db_SET_analytics(db_path)
        
    def add_current_situation_to_db(self):
        self.calculate_all_windows_sets_count()
        self.get_pattern_stats()
        onepattern_dict = self.get_pattern_as_dict()
        self.db_set.add_pattern(onepattern_dict)
        
    def reset_pattern(self):
        self.deck = create_deck(parameters, False, True)
        
        # normal pattern: 9x9. But, to handle the edge cases: we extend the 9x9 pattern 2x2  so: 18x18. where (0,0) == (9,0) == (0,9) == (9,9)
        self.pattern_extended = {(row,col):None  for row in range(PATTERN_ROWS *2) for col in range(PATTERN_COLS*2)}
        self.pattern_tagged_positions = {(row,col):0  for row in range(PATTERN_ROWS *2 ) for col in range(PATTERN_COLS *2)}
        
        # top left corner of a cards window in the pattern. every position contains the amount of sets in the window with position as upper left corner of this window.
        self.set_counts_pattern = {(row,col):0 for row in range(PATTERN_ROWS) for col in range(PATTERN_COLS) }
        self.basic_pattern_positions = self.get_all_basic_pattern_positions()
        self.pattern_total_sets_count = None
        self.sets_count_window_distribution= None
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
            property= list(parameters.keys())[property_index]
            # print(parameters[property])
            value_index = parameters_single_char[property].index(value)
            
            # card[property] = parameters[property][value_index]
            card.append(parameters[property][value_index])
        card = tuple(card)
        return card
        
    def restore_archived_pattern(self, pattern_dict):
        # pattern_dict --> contains "pattern" key with compacted pattern value. e.g. ['2RoP', '2RsP', '2GoS', '2RhP', '1RhD', '2RsD', '2GoD', '2GoP', '3RoS', '1RsD', '3BhD', '3BsS', '1BoP', '2RsS', '2BoP', '3RoP', '2GhP', '1RoD', '3BoD', '1RhP', '1RsP', '1BoD', '2BoS', '2BhS', '2GhS', '3RhD', '1RoP', '1GoS', '3GsP', '2BsD', '3RsS', '2GhD', '1RoS', '3BsD', '1BsD', '3GoP', '1BhS', '3BoP', '1RhS', '2BsS', '2GsS', '1GhS', '2BsP', '2BoD', '2GsD', '1GsP', '3GhS', '2RhD', '1GsD', '1GoP', '2BhP', '1GhD', '1BoS', '3GsD', '1GsS', '3GoD', '1GhP', '2BhD', '3GhP', '2GsP', '2RoS', '3GsS', '3GoS', '1BsS', '3BoS', '1GoD', '1RsS', '3GhD', '2RhS', '1BhD', '3RoD', '1BhP', '2RoD', '1BsP', '3BhS', '3RsD', '3RhS', '3RhP', '3BhP', '3BsP', '3RsP']
        self.reset_pattern()
        compact_pattern = pattern_dict["pattern"]
            
        positions = self.get_all_basic_pattern_positions()
        for card_str,position in zip(compact_pattern,positions):
            # print("origin card string and position: {} , {}".format(card_str,position))
            card_tuple = self.card_compact_to_normal(card_str)
            self.add_card_to_pattern(card_tuple, position)
        
        self.print_pattern()
        
    def get_pattern_as_dict(self):
        return {"pattern":self.get_pattern_compact(False, True, True), "window_stats":self.sets_count_window_distribution}
         
    def get_all_basic_pattern_positions(self):
        return [(row, col) for row in range(PATTERN_ROWS) for col in range(PATTERN_COLS)  ]
    
    def create_full_pattern(self):
        # reset and fill full pattern. 
        self.reset_pattern()
        positions = self.get_all_basic_pattern_positions()
        for pos in positions:
            self.add_card_to_pattern(None, pos)
    
    
    def print_pattern_tags(self):
        print(self.get_pattern_values_as_string(self.pattern_tagged_positions))
    
    def get_tag_card_at_pattern_position(self, position):
        return self.pattern_tagged_positions[position] 
    
    def get_pattern_tagged_positions_basic(self):
        return {k:v for k,v in self.pattern_tagged_positions.items() if k in self.basic_pattern_positions }
        
    
    def set_tag_card_at_pattern_position(self, position, add_value):
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
        self.pattern_tagged_positions[(extended_row, extended_col)] += add_value
        
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
        
        self.deck.append( self.pattern_extended[(initial_row, initial_col)] )
            
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
    
    def get_pattern_compact(self, extended=False, compacted=True, as_list=True):
        # if extended:
        #     AssertionError, "not implemented"
        return_pattern = {}
        for row in range(PATTERN_ROWS + extended * PATTERN_ROWS):
            for col in range(PATTERN_COLS + extended * PATTERN_COLS):
                return_pattern[(row,col)] = self.pattern_extended[(row,col)]
                
        compacted_dict = {}
        if compacted:
            for k,v in return_pattern.items():
                if v is None:
                    compacted_dict[k] = "****"
                else:    
                    compacted_dict[k] = "".join(item[0] for item in v)  # take first char from each value
            return_pattern = compacted_dict
        
        pattern_as_list =[]
        if as_list:
            for row in range(PATTERN_ROWS + extended * PATTERN_ROWS):
                for col in range(PATTERN_COLS + extended * PATTERN_COLS):
                    val = return_pattern[(row,col)]
                    pattern_as_list.append(val)
            return_pattern = pattern_as_list
        
        return return_pattern
        
    def get_pattern_as_string(self, print_extended=False):
        pattern_str = ""
        for row in range(PATTERN_ROWS + print_extended * PATTERN_ROWS):
            line_string = ""
            for col in range(PATTERN_COLS + print_extended * PATTERN_COLS):
                card_tuple = self.pattern_extended[(row,col)]
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
        return [ (window_position[0] + row ,window_position[1] + col) for row in range (PATTERN_WINDOW_ROWS) for col in range(PATTERN_WINDOW_COLS) ]
        
    def get_cards_from_basic_pattern(self):
        cards = []
        for pos in self.get_all_basic_pattern_positions():
            cards.append(self.get_card_from_pattern(pos))
        return cards
            
    def get_window_cards_from_pattern(self, window_position ):
        positions = self.get_pattern_positions_from_window_position(window_position)
        # print("feijiejf{}".format(positions))
        cards = []
        for position in positions:
            cards.append(self.get_card_from_pattern(position))
        return cards
    
    def get_set_count_in_window(self, window_position):
        cards = self.get_window_cards_from_pattern(window_position)
        sets_count = set_in_cards(cards, False, True)
        return sets_count

    def calculate_all_windows_sets_count(self):
        window_positions = self.get_all_basic_pattern_positions()
        for position in window_positions:
            self.set_counts_pattern[position] = self.get_set_count_in_window(position)            
    
    def get_pattern_values_as_string(self, pattern_values):
        values_str = ""
        for row in range (PATTERN_ROWS):
            line_string = ""
            for col in range (PATTERN_COLS):
                val = pattern_values[(row,col)]
                line_string += "{:<4}".format(val) 
            values_str += line_string + "\n"
        return(values_str)
        
    def print_set_counts_pattern(self):
        print(self.get_pattern_values_as_string(self.set_counts_pattern))
            
    def get_pattern_stats(self, verbose=False):
        sets_count = 0
        sets_count_window_distribution= [0 for i in range(20)]
        
        for row in range(PATTERN_ROWS ):
            for col in range(PATTERN_COLS):
                set_count = self.set_counts_pattern[(row,col)]
                sets_count += set_count
                sets_count_window_distribution[set_count]+=1
        if verbose:
            print("Total sets: {}" .format(sets_count))
            print("Sets per window distribution: {}" .format(sets_count_window_distribution))
        check_count = 0
        for i,count in enumerate(sets_count_window_distribution):
            check_count += i*count
        if verbose:
            print("check: {}".format(check_count))
        self.pattern_total_sets_count = sets_count
        self.sets_count_window_distribution= sets_count_window_distribution 
        return sets_count_window_distribution
    
    def save_pattern_to_file(self, base_path):
        base_path = Path(base_path)
        single_set_windows = self.sets_count_window_distribution[1]
        name = "SET_pattern_{}_{}_{}.txt".format(str(single_set_windows),str(self.pattern_total_sets_count),str(self.sets_count_window_distribution) )
        
        with open(Path(base_path,name), 'w') as file:
            pattern_string = self.get_pattern_as_string()
            file.write(f"{pattern_string}\n")
            sets_counts_windows_as_string = self.get_set_counts_pattern_as_string()
            file.write(f"{sets_counts_windows_as_string}\n")
    
    def start_search_all_windows_single_set(self):
        
        self.create_full_pattern()
        self.cyclic_swapping_single_set_improvement()
        
    def cyclic_swapping_single_set_improvement(self):
        # pattern_weigth_post_swap = 666666666666666
        # # pattern_weigth_pre_swap = None
        # while pattern_weigth_post_swap > 0:
        #     pattern_weigth_pre_swap, pattern_weigth_post_swap, is_swapped  = self.swap_improve_single_set_window(pattern_weigth_pre_swap)

        
        
        i = 0
        pattern_weigth_pre_swap = 99999999
        pattern_weigth_post_swap = pattern_weigth_pre_swap
        
        while True:
            i+=1 
            pattern_weigth_pre_swap, pattern_weigth_post_swap, is_swapped  = self.swap_improve_single_set_window()
            if i%1000 == 0:
                print ("Swap Cycle {}".format(i))
            if is_swapped and pattern_weigth_pre_swap != pattern_weigth_post_swap:
                print ("--------SET PATTERN STATS after {} cycles:-----------".format(i))
                self.print_pattern()
                print("swapped. New weight is: {}, old weight was {}".format(pattern_weigth_post_swap, pattern_weigth_pre_swap))
                
                # print ("total one set per window score (0= all windows one set): {}".format(pattern_weigth))
                self.calculate_all_windows_sets_count()
                self.get_pattern_stats(True)
                self.print_set_counts_pattern()
                self.get_full_pattern_weight(verbose=True)
            
       
    def swap_improve_single_set_window(self):
        # improve the amount of single set windows by swapping cards and analysing.
        
        # 1. analyse 
        # 2. select swap positions. and swap cards a random from most non matching window
        # 2. swap
        # 3. analyse again
        # 4. if situation improved--> safe. If not, undo.
        
        self.calculate_all_windows_sets_count()
        
        # assigning card position weights 
        for position in self.basic_pattern_positions:
            set_count_in_window = self.set_counts_pattern[position]     
            window_positions = self.get_pattern_positions_from_window_position(position)
            for wp in window_positions:
                if set_count_in_window ==0:
                    # 0 is equally bad as two
                    score = 2
                else:
                    score = set_count_in_window
                self.set_tag_card_at_pattern_position(wp, score)
                
                
        # get highest score positions
        # AMOUNT_OF_SWAPPABLE_POSITIONS = 15 # best pattern_weight of about 23
        # AMOUNT_OF_SWAPPABLE_POSITIONS = 20 # best pattern weight of about 15
        AMOUNT_OF_SWAPPABLE_POSITIONS = 81 # best pattern_weight of about 23
        
        tagged_position_basic_pattern = self.get_pattern_tagged_positions_basic()
        # print(tagged_position_basic_pattern)
        swappable_positions = [k for k, v in sorted(tagged_position_basic_pattern.items(), key=lambda item: item[1], reverse=True)[:AMOUNT_OF_SWAPPABLE_POSITIONS]]
        # print(swappable_positions)
        
        # print(values_of_swappable_positions)
        # select swap positions: unweighted.
        # swap_pos_1 = swappable_positions.pop(random.randint(0, len(swappable_positions) - 1))
        # swap_pos_2 = swappable_positions.pop(random.randint(0, len(swappable_positions) - 1))
        
        # select swap positions: weighted.
        # then higher the score, the more probability to be picked
        
        PROBABILITY_MULTIPLIER = 50
        values_of_swappable_positions = [PROBABILITY_MULTIPLIER*tagged_position_basic_pattern[p] for p in swappable_positions]
        swap_pos_1_index = random.choices(range(len(swappable_positions)), weights=values_of_swappable_positions, k=1)[0]
        swap_pos_2_index = swap_pos_1_index
        while  swap_pos_2_index == swap_pos_1_index:
            swap_pos_2_index = random.choices(range(len(swappable_positions)), weights=values_of_swappable_positions, k=1)[0]
        
        swap_pos_1 = swappable_positions[swap_pos_1_index]
        swap_pos_2 = swappable_positions[swap_pos_2_index]
        
        # print(swappable_positions)
        
        # we now have a weighted array for all card positions --> i12 means, all windows containing this card have exactly one SET. 
        pre_swap_pattern_weight = self.get_full_pattern_weight()
        
    
        
        # do the swap
        orig_card_pos_1 = self.get_card_from_pattern(swap_pos_1)
        orig_card_pos_2 = self.get_card_from_pattern(swap_pos_2)
        self.remove_card_from_pattern(swap_pos_1)
        self.remove_card_from_pattern(swap_pos_2)
        self.add_card_to_pattern(orig_card_pos_2, swap_pos_1 )
        self.add_card_to_pattern(orig_card_pos_1, swap_pos_2 )
        
        # do analysis again
        self.calculate_all_windows_sets_count()
        post_swap_pattern_weight = self.get_full_pattern_weight()
        
        if post_swap_pattern_weight > pre_swap_pattern_weight:   # todo > or >=  (Lode thinks > )
            # undo if the weight didn't improve 
            self.remove_card_from_pattern(swap_pos_1)
            self.remove_card_from_pattern(swap_pos_2)
            self.add_card_to_pattern(orig_card_pos_1, swap_pos_1 )
            self.add_card_to_pattern(orig_card_pos_2, swap_pos_2 ) 
            return pre_swap_pattern_weight, post_swap_pattern_weight, False
        
        else:
            # if weight is equal, be ok with the changes. Prevents from being stuck in a situation for too long?! OK or not ?!
            return pre_swap_pattern_weight, post_swap_pattern_weight,True
            # return post_swap_pattern_weight
        
    def get_full_pattern_weight(self, verbose=False):
        # 1 set per window is what we want. their weight is zero. 2 set windows add weight of 1, 3 set windows asdd weight of 2, ....    AND 0 set window add weight of 1
         
        distribution = self.get_pattern_stats()
        total_pattern_weight = 0   
        
        # zero set windows get a punish point. 
        # one set windows: no punish points
        # two  set windows: two punish points
        # ... 
        if verbose:
            print(distribution)
        for i,set_count in enumerate(distribution):
            if i == 0:
                total_pattern_weight += 1* set_count 
            elif i == 1:
                # add zero
                pass 
            else:
                total_pattern_weight += (i-1) * set_count
        if verbose:
            print ("Pattern weigth = {} ".format(total_pattern_weight))
        return total_pattern_weight
    
    def start_recursive_single_set_window_pattern_search(self):
        
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
            print ("SEARCH FINISHED successfully")
        
            self.calculate_all_windows_sets_count()
            self.print_set_counts_pattern()
        else:
            print ("SEARCH FINISHED. No pattern found....")
            
        
        self.print_pattern()
        
        # fill in missing cards
    def recursive_single_set_window_pattern_search(self, window_index):
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
        positions_in_window = self.get_pattern_positions_from_window_position(window_position)
        
        # check which positions have no cards in the window
        empty_positions_in_window = []
        for pos in positions_in_window:
            if self.pattern_extended[pos] is None:
                empty_positions_in_window.append(pos)
        
        attempts = 11
        # self.print_pattern()
        while attempts > 0:
            self.i += 1
            if self.i%10000 == 0:
                self.print_pattern()
                
                if (window_index > 10):
                    self.add_current_situation_to_db()
                self.calculate_all_windows_sets_count()
                self.print_set_counts_pattern()
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
                is_finished = self.recursive_single_set_window_pattern_search(window_index + 1)
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
    #             self.set_tag_card_at_pattern_position(window_top_right_position, True)
    #             # window_positions = self.get_pattern_positions_from_window_position(position)
    #             # for wp in window_positions:
    #             #     self.set_tag_card_at_pattern_position(wp, True)
                
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
    #                 self.set_tag_card_at_pattern_position(wp, True)
               
               
def generate_set_patterns_to_file():
    for i in range (1):
        setgame = SET()
        setgame.create_full_pattern()
        setgame.calculate_all_windows_sets_count()
        setgame.print_pattern(False)
        setgame.print_set_counts_pattern()
        # window_positions = setgame.get_pattern_positions_from_window_position((0,0))
        setgame.get_pattern_stats()
        setgame.save_pattern_to_file("C:\Data\generated_program_data\SET_pattern")
        
    
def generate_set_patterns_to_db(db_path,attempts=100):
     
    db_set = db_SET_analytics(db_path)
    
    for i in range (attempts):
        setgame = SET()
        setgame.create_full_pattern()
        setgame.calculate_all_windows_sets_count()
        # setgame.print_pattern(False)
        # print(setgame.pattern_extended)
        # setgame.print_set_counts_pattern()
        # window_positions = setgame.get_pattern_positions_from_window_position((0,0))
        setgame.get_pattern_stats()
        onepattern_dict = setgame.get_pattern_as_dict()
        
        db_set.add_pattern(onepattern_dict)
        
def retrieve_most_promising_pattern(db_path):
    db_set = db_SET_analytics(db_path)
    pattern_dict = db_set.get_pattern_with_most_single_set_windows()
    setgame = SET()
    print(pattern_dict)
    setgame.restore_archived_pattern(pattern_dict)
    setgame.print_pattern()
    setgame.calculate_all_windows_sets_count()
    setgame.print_set_counts_pattern()
    setgame.get_pattern_stats(True)
    improve_single_set_windows(setgame)
    
def improve_single_set_windows(setgame):
    # setgame = SET()
    
    i = 0
    pattern_weigth_pre_swap = 99999999
    pattern_weigth_post_swap = pattern_weigth_pre_swap
    
    while True:
        i+=1 
        pattern_weigth_pre_swap, pattern_weigth_post_swap, is_swapped  = setgame.swap_improve_single_set_window()
        if i%1000 == 0:
            print ("Swap Cycle {}".format(i))
        if is_swapped and pattern_weigth_pre_swap != pattern_weigth_post_swap:
        # if i%100 == 0:
            print ("--------SET PATTERN STATS after {} cycles:-----------".format(i))
            setgame.print_pattern()
            print("swapped. New weight is: {}, old weight was {}".format(pattern_weigth_post_swap, pattern_weigth_pre_swap))
            
            # print ("total one set per window score (0= all windows one set): {}".format(pattern_weigth))
            setgame.calculate_all_windows_sets_count()
            setgame.get_pattern_stats(True)
            setgame.print_set_counts_pattern()
            setgame.get_full_pattern_weight(verbose=True)
    
def test():
    import random

    # List of values
    values = [3, 4, 40, 2]

    # Pick multiple indices
    k = 2  # Number of indices to pick
    random_indices = random.choices(range(len(values)), weights=values, k=2)

    print(f"Picked indices: {random_indices}")
    
if __name__ == "__main__":
    # test()
    # exit()
     
    db_path = "C:\Data\generated_program_data\SET_pattern_searcher\set_patterns.db"
    
    setgame = SET()
    setgame.start_search_all_windows_single_set()
    exit()
    # setgame.setup_db(db_path)
    # setgame.start_recursive_single_set_window_pattern_search()
    
    # generate_set_patterns_to_db(db_path, attempts=100000)
        
    
    # retrieve_most_promising_pattern(db_path)
     
    
    setgame = SET()
    setgame.create_full_pattern()
    setgame.print_pattern()
    setgame.print_set_counts_pattern()
    setgame.calculate_all_windows_sets_count()
    setgame.get_pattern_stats(True)
    improve_single_set_windows(setgame)
    
    # setgame.print_pattern()
    # setgame.tag_multiset_window_cards()
    # setgame.print_pattern_tags()
    