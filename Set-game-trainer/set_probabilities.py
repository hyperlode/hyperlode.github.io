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
    
def set_in_cards(cards, verbose=False):
    if len(cards) < 3:
        return False
    
    # check if there is a set in cards
    combinations_of_three_cards = list(itertools.combinations(cards, 3))
    
    for three_cards in combinations_of_three_cards:
        if verbose:
            print(three_cards)
        if is_set(three_cards, verbose=False):
            if verbose:
                print("SET FOUND")
                print(three_cards)
            return True
    
    return False
    
def take_cards_off_deck_until_set(deck):
    
    for count in range(len(deck)):
        # print(count)
        cards = deck[:count]
        is_set_in_cards = set_in_cards(cards)
        if is_set_in_cards:
            # print("{} cards taken off deck before a set was found".format(count))
            
            if count >= 17:
                # write to file
                with open("c:/temp/SET_interesting_sequences.txt", "a") as myfile:
                    myfile.write(str(cards)+"\n")
            return count
        # if count > 4:
        #     break
    print ("No Set found")
    raise AssertionError
def display_probabilities(frequency_list):
    tests_count = sum(frequency_list)
    percentages = [f/tests_count for f in frequency_list]
    print("-----Set probability after laying x cards (total tests: {})".format(tests_count))
    for i,p in enumerate(percentages):
        cumulative_probability = sum (percentages[:i+1])
        bar_cumul = '█' * int(cumulative_probability*100)
        bar_individual = '█' * int(p*100)
        print("{:02d}:{}. {:.5f}, {:.2f}%, cumul:{:.2f}%, ({})".format(i, bar_individual, p, p*100, cumulative_probability*100, frequency_list[i]))


def test_cards_needed_for_set():
    # do a lot of tests where we take a deck of SET cards and shuffle it. 
    # how many cards do we need to take until a SET is found?
    probabilities = [0 for i in range(20)]
    for i in range(1000001):
        if i%1000 == 0 and i > 0:
            display_probabilities(probabilities)
        
        deck = create_deck(parameters, formatted=False, shuffled=True)
        card_draws_before_set = take_cards_off_deck_until_set(deck)
        probabilities[card_draws_before_set]+=1

def test_cards_drawing_count_until_set():
    # do a lot of tests where we take a deck of SET cards and shuffle it. 
    # how many cards do we need to take until a SET is found?
    probabilities = [0 for i in range(20)]
    for i in range(1000001):
        if i%1000 == 0 and i > 0:
            display_probabilities(probabilities)
        
        deck = create_deck(parameters, formatted=False, shuffled=True)
        card_draws_before_set = take_cards_off_deck_until_set(deck)
        probabilities[card_draws_before_set]+=1

def test_stacked_deck_cards_drawing_count_until_set(test_play_count=1000000, non_red_cards_count=0):
    # do a lot of tests where we take a deck of SET cards and shuffle it. 
    # how many cards do we need to take until a SET is found?
    probabilities = [0 for i in range(20)]
    for i in range(test_play_count):
        if i%1000 == 0 and i > 0:
            display_probabilities(probabilities)
        
        # deck = deck_stack_only_greens_at_start(8)
        deck = deck_stack(non_red_cards_count)
        card_draws_before_set = take_cards_off_deck_until_set(deck)
        probabilities[card_draws_before_set]+=1
    display_probabilities(probabilities)

def deck_stack(nonRedCardsDrawnCount=0):
    # WARNING: for now, nonRedCardsDrawnCount and non_blue_cards_count needs to be the same (aka: cards that are green)
    
    deck = create_deck(parameters, formatted=True, shuffled=False)
    # create deck D
    # take all the red cards separtely R
    # shuffle the others D - R = O
    # take the first N cards  from O 
    # shuffle all other cards ( N - O)  + R = M
    # add to the N cards   N + M 
    # we now have a deck where we're sure the first N cards are NOT Red.
    
    excluded_cards_count = nonRedCardsDrawnCount
    
    nonExcludedValues = []
    excludedValues = []
    for card in deck:
        if card["colour"] == "Red":
            excludedValues.append(card)
        else:
            nonExcludedValues.append(card)
        
    random.shuffle(nonExcludedValues)
    
    if len(nonExcludedValues) < excluded_cards_count:
        raise AssertionError("can not fulfil request.")
    nonRedCardsAtStart = nonExcludedValues[:excluded_cards_count]
    otherNonRedCards = nonExcludedValues[excluded_cards_count:]
    otherCards = otherNonRedCards + excludedValues
    random.shuffle(otherCards)
    
    deck = nonRedCardsAtStart + otherCards
    # for card in deck:
    #     print (card)
    deck = [list(card.values()) for card in deck]
    return deck

def deck_stack_only_greens_at_start(green_cards_at_start_count=0):
    deck = create_deck(parameters, formatted=True, shuffled=False)
  
    greenCards = []
    redCards = []
    blueCards = []
    
    for card in deck:
        if card["colour"] == "Red":
           redCards.append(card) 
        elif card["colour"] == "Blue":
            blueCards.append(card)
        else:
            greenCards.append(card)
        
    random.shuffle(greenCards)
    
    if len(greenCards) < green_cards_at_start_count:
        raise AssertionError("can not fulfil request.")
    greenCardsAtStart = greenCards[:green_cards_at_start_count]
    otherGreenCards = greenCards[green_cards_at_start_count:]
    otherCards = otherGreenCards + redCards + blueCards
    random.shuffle(otherCards)
    
    deck = greenCardsAtStart + otherCards
    # for card in deck:
    #     print (card)
    deck = [list(card.values()) for card in deck]
    return deck
        
            
if __name__ == "__main__":
    # test_cards_drawing_count_until_set()
    # deck = deck_stack(54)
    # for card in deck:
    #     print (card)
    test_stacked_deck_cards_drawing_count_until_set(test_play_count=1000000, non_red_cards_count=0)
    
    # deck_stack_only_greens_at_start(5)