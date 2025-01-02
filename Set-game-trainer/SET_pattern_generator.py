# check set probabilities as cards are added. 

import itertools
import random


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
        self.set_counts_window = {(row,col):0 for col in range(PATTERN_COLS) for row in range(PATTERN_ROWS)}
    
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
    
    
    def print_set_counts_windows(self):
        for row in range (PATTERN_ROWS):
            
            line_string = ""
            for col in range (PATTERN_COLS):
                sets = self.set_counts_window[(row,col)]
                line_string += "{:<4}".format(sets) 
            print(line_string)
            
            
    def print_pattern(self, print_extended=False):
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

            print(line_string + "\n")
    
   
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
            self.set_counts_window[position] = self.get_set_count_in_window(position)            
        
            
if __name__ == "__main__":
    deck = create_deck(parameters, False, True)
    setgame = SET()
    positions = setgame.get_all_basic_pattern_positions()
    for pos in positions:
        setgame.add_card_to_pattern(deck.pop(), pos)
    setgame.calculate_all_windows_sets_count()
    setgame.print_pattern(False)
    setgame.print_set_counts_windows()
    # window_positions = setgame.get_pattern_positions_from_window_position((0,0))
    
    
    # print(window_positions)