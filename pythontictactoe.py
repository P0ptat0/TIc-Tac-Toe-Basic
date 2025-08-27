import pickle
import random

def load_stats(filename):
    try:
        with open(filename, 'rb') as f:
            stats = pickle.load(f)
    except (EOFError, FileNotFoundError):
        stats = [0, 0, 0]  # Default values if file doesn't exist or is empty
    return stats

# Function to save game statistics to file
def save_stats(filename, stats):
    with open(filename, 'wb') as f:
        pickle.dump(stats, f)

# Initialize game statistics from file
stats_filename = 'logs.dat'
wincount, losecount, drawcount = load_stats(stats_filename)

# Print current statistics
print("Current Statistics:")
print("Wins:", wincount)
print("Losses:", losecount)
print("Draws:", drawcount)

print("""the board is marked as shown below,the input number corresponds to a square
 0 | 1 | 2
───────────
 3 | 4 | 5
───────────
 6 | 7 | 8""")

# Turns the board(list) into a tictactoe grid
def print_board():
    print(board[0],'|',board[1],'|',board[2],'\n──────────')
    print(board[3],'|',board[4],'|',board[5],'\n──────────')
    print(board[6],'|',board[7],'|',board[8])

# Defining the win condition
def wincondition(a):
    if (board[0]==a and board[1]==a and board[2]==a): 
        return True
    elif (board[3]==a and board[4]==a and board[5]==a): 
        return True
    elif (board[6]==a and board[7]==a and board[8]==a): 
        return True
    elif (board[0]==a and board[3]==a and board[6]==a): 
        return True
    elif (board[1]==a and board[4]==a and board[7]==a): 
        return True
    elif (board[2]==a and board[5]==a and board[8]==a): 
        return True
    elif (board[0]==a and board[4]==a and board[8]==a): 
        return True
    elif (board[2]==a and board[4]==a and board[6]==a): 
        return True

# Allows the player to play a move
def player(o):
    while True:
        a=int(input('enter num between 0-8: '))
        if (board[a]=='X') or (board[a]=='O'):
            print("that box is aldready marked,Try again")
        else:
            board[a]=o
            break

# A bot which plays random moves
def bot1():
    while True:
        z=random.randint(0,8)
        if board[z]=='X' or board[z]=='O':
            continue
        else:
            board[z]='O'
            break

# Allows the bot to detect if 2 X's are in a row and will block it, or allows the bot to play an O if 2 O's are in a row
def think_bot(a,b,c,d,e):
    if board[a]==d and board[b]==d:
        if board[c] ==' ':
            board[c]=e
            return True
    if board[a]==d and board[c]==d:
        if board[b] ==' ':
            board[b]=e
            return True
    if board[b]==d and board[c]==d:
        if board[a] ==' ':
            board[a]=e
            return True

# Defining all possible variations of playing the winning move or blocking the players winning move
def think_grp():
    if think_bot(0,1,2,'O','O'):
        return True
    if think_bot(3,4,5,'O','O'):
        return True
    if think_bot(6,7,8,'O','O'):
        return True
    if think_bot(0,3,6,'O','O'):
        return True
    if think_bot(1,4,7,'O','O'):
        return True
    if think_bot(2,5,8,'O','O'):
        return True
    if think_bot(0,4,8,'O','O'):
        return True
    if think_bot(2,4,6,'O','O'):
        return True
    if think_bot(0,1,2,'X','O'):
        return True
    if think_bot(3,4,5,'X','O'):
        return True
    if think_bot(6,7,8,'X','O'):
        return True
    if think_bot(0,3,6,'X','O'):
        return True
    if think_bot(1,4,7,'X','O'):
        return True
    if think_bot(2,5,8,'X','O'):
        return True
    if think_bot(0,4,8,'X','O'):
        return True
    if think_bot(2,4,6,'X','O'):
        return True
    
# A bot which uses the think module along and plays a random move if nothing else exists
def bot2():
    if think_grp():
        return True
    else:
        bot1()

def draw(count):
    if count==9:
        return True

# The game loop
while True:
    board = [' ',' ',' ',' ',' ',' ',' ',' ',' ']
    count=0
    play=input('do you wish to play/continue?("no" to exit)')
    if play.lower()=='no':
        print('no of wins',wincount,'no of losses',losecount,'no of draws',drawcount)
        break
    p_or_b=input('do you wish to play with a bot or player?("player" to play with player)')
    if p_or_b=='player':
        while True:
            print_board()
            print("player1's Turn")
            player('X')
            count+=1
            if wincondition('X'):
                wincount+=1
                print("\n player1 wins \n")
                print_board()
                break
            print_board()
            if draw(count):
                drawcount+=1
                print('\n draw \n')
                print_board()
                break
            print("player2's Turn")
            player('O')
            count+=1
            if wincondition('O'):
                losecount+=1
                print("\n player2 wins \n")
                print_board()
                break
    else:
        botlv=int(input('choose bot level(1 or 2):'))
        first=input('who plays first?(bot or player):')
        if first=='player':
            while True:
                print_board()
                player('X')
                count+=1
                if wincondition('X'):
                    wincount+=1
                    print("\n You win \n")
                    print_board()
                    break
                if draw(count):
                    drawcount+=1
                    print('\n draw \n')
                    print_board()
                    break
                print("\n Computer's Turn \n")
                if botlv==1:
                    bot1()
                    count+=1
                if botlv==2:
                    bot2()
                    count+=1
                if wincondition('O'):
                    losecount+=1
                    print("\n Computer wins \n")
                    print_board()
                    break
        else:
            while True:
                print("\n Computer's Turn\n")
                if botlv==1:
                    bot1()
                    count+=1
                if botlv==2:
                    bot2()
                    count+=1
                if wincondition('O'):
                    losecount+=1
                    print("\n Computer wins \n")
                    print_board()
                    break
                if draw(count):
                    drawcount+=1
                    print('\n draw \n')
                    print_board()
                    break
                print_board()
                player('X')
                count+=1
                if wincondition('X'):
                    wincount+=1
                    print("\n You win \n")
                    print_board()
                    break
print("Current Statistics:")
print("Wins:", wincount)
print("Losses:", losecount)
print("Draws:", drawcount)


save_stats(stats_filename, [wincount, losecount, drawcount])
 
