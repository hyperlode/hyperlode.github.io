# check set probabilities as cards are added. 

import itertools
import random
from pathlib import Path


# Set
#card options
PROPERTIES_COUNT = 3
VALUES_COUNT = 4
parameters = { "colour":["Red", "Green", "Blue"], "shape":["Squigle","Pill","Diamond"],"quantity":["1","2","3"], "infill":["Solid","Blank","Arced"]}

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

    return combinations

def is_set(three_cards, verbose=False):
    # cards as lists
    
    #check
    
    #bundle
    separated_per_property = list(zip(*three_cards))
    
    #check
    for p in separated_per_property:
        assert len(p)== PROPERTIES_COUNT, "Incorrect card "
    
    separated_per_property_as_different_values = [set(p) for p in separated_per_property]
    
    is_set = True
    # check for all values diff or all equal per parameter SET fulfillment requirement
    for diff_values in separated_per_property_as_different_values:
        diff_count = len(diff_values)
        if len(diff_values) == 1 or len(diff_values) == PROPERTIES_COUNT:
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

PATTERN_COLS = 9
PATTERN_ROWS = 9

WINDOW_ROWS = 3
WINDOW_COLS = 4


                              
class SET(): 
    
    def __init__(self):
        
        
        #self.base_pattern_positions = self.get_all_basic_pattern_positions()
        
        # normal pattern: 9x9. But, to handle the edge cases: we extend the 9x9 pattern 2x2  so: 18x18. where (0,0) == (9,0) == (0,9) == (9,9)
        self.pattern_extended = {(row,col):None for col in range(PATTERN_COLS*2) for row in range(PATTERN_ROWS *2)}
        
        # top left corner of a cards window in the pattern.  
        self.set_counts_pattern = {(row,col):0 for col in range(PATTERN_COLS) for row in range(PATTERN_ROWS)}

        self.pattern_total_sets_count = None
        self.sets_count_window_distribution= None
         
    def get_all_basic_pattern_positions(self):
        return [(row, col) for col in range(PATTERN_COLS) for row in range(PATTERN_ROWS) ]
      
    def add_card_to_pattern(self, card, position):
        
        initial_col = position[0]
        initial_row = position[1]
        
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
            
        self.pattern_extended[(initial_col, initial_row)] = card
        self.pattern_extended[(initial_col, extended_row)] = card
        self.pattern_extended[(extended_col, initial_row)] = card
        self.pattern_extended[(extended_col, extended_row)] = card
    
    def get_card_from_pattern(self, position):
        return self.pattern_extended[position]
    
    def get_pattern_as_string(self, print_extended=False):
        pattern_str = ""
        for row in range(PATTERN_ROWS + print_extended * PATTERN_ROWS):
            line_string = ""
            for col in range(PATTERN_COLS + print_extended * PATTERN_COLS):
                card_tuple = self.pattern_extended[(row,col)]
                if card_tuple is None:
                    card_tuple_short = "xxxxxxx"
                else:    
                    card_tuple_short = [t[:2] for t in card_tuple]
                    
                card_string = ""
                for element in card_tuple_short:
                    card_string += element
                
                line_string += "{:<8}".format(str(card_string))

            pattern_str += line_string + "\n"
        return pattern_str
            
    def print_pattern(self, print_extended=False):
        print(self.get_pattern_as_string(print_extended))
    
    def get_pattern_positions_from_window_position(self, window_position):
        return [ (window_position[0] + row ,window_position[1] + col) for row in range (WINDOW_ROWS) for col in range(WINDOW_COLS) ]
        
    def get_window_cards_from_pattern(self, window_position ):
        positions = self.get_pattern_positions_from_window_position(window_position)
        
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
    
    
    
    def get_set_counts_pattern_as_string(self):
        window_set_counts_str = ""
        for row in range (PATTERN_ROWS):
            line_string = ""
            for col in range (PATTERN_COLS):
                sets = self.set_counts_pattern[(row,col)]
                line_string += "{:<4}".format(sets) 
            window_set_counts_str += line_string + "\n"
        return(window_set_counts_str)
            
    def print_set_counts_pattern(self):
            print(self.get_set_counts_pattern_as_string())
            
    def pattern_stats(self):
        sets_count = 0
        sets_count_window_distribution= [0 for i in range(20)]
        
        for row in range(PATTERN_ROWS ):
            for col in range(PATTERN_COLS):
                set_count = self.set_counts_pattern[(row,col)]
                sets_count += set_count
                sets_count_window_distribution[set_count]+=1
        print("Total sets: {}" .format(sets_count))
        print("Sets per window distribution: {}" .format(sets_count_window_distribution))
        check_count = 0
        for i,count in enumerate(sets_count_window_distribution):
            check_count += i*count
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
                    
if __name__ == "__main__":
    for i in range (10000):
        deck = create_deck(parameters, False, True)
        setgame = SET()
        positions = setgame.get_all_basic_pattern_positions()
        for pos in positions:
            setgame.add_card_to_pattern(deck.pop(), pos)
        setgame.calculate_all_windows_sets_count()
        setgame.print_pattern(False)
        setgame.print_set_counts_pattern()
        # window_positions = setgame.get_pattern_positions_from_window_position((0,0))
        setgame.pattern_stats()
        setgame.save_pattern_to_file("C:\Data\generated_program_data\SET_pattern")
        
    # print(window_positions)