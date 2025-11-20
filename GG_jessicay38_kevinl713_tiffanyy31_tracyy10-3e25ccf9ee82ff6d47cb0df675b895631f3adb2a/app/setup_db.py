import json  
import sqlite3 
import os  

DB_FILE = "GG_database.db" 

def create_tables(): 
    db = sqlite3.connect(DB_FILE) 
    c = db.cursor() 
    c.execute(''' 
        CREATE TABLE IF NOT EXISTS users ( 
            username TEXT NOT NULL UNIQUE COLLATE NOCASE, 
            password TEXT NOT NULL, 
            character TEXT NOT NULL,  
            unlockedChars TEXT NO NULL,  
            points INTEGER NO NULL, 
            highscore INTEGER NO NULL, 
            musicPref TEXT NO NULL, 
            message TEXT NO NULL  
        ); 
        ''') 
    c.execute(''' 
        CREATE TABLE IF NOT EXISTS themes ( 
            username TEXT NOT NULL UNIQUE COLLATE NOCASE, 
            theme TEXT NO NULL UNIQUE, 
            color1 TEXT NO NULL, 
            color2 TEXT NO NULL  
        ); 
        ''') 
    db.commit() 
    db.close() 
 
#USER INFO

def create_user(username, password): 
    db = sqlite3.connect(DB_FILE) 
    c = db.cursor()
    c.execute("INSERT INTO users (username, password, character, unlockedChars, points, highscore, musicPref) VALUES (?, ?, ?, ?, ?, ?, ?)", (username, password, "", "", 0, 0, "This user was too cool for a message"))  
    db.commit()
    db.close()

def get_username(username): 
    db = sqlite3.connect(DB_FILE) 
    c = db.cursor()
    username = c.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchall()
    db.commit()
    db.close()
    return username 

def get_password(username): 
    db = sqlite3.connect(DB_FILE) 
    c = db.cursor() 
    password = c.execute("SELECT password FROM users WHERE username = ?", (username,)).fetchone() 
    db.commit()
    db.close()
    return password[0] 

 #POINTS

def add_points(username, points): 
    db = sqlite3.connect(DB_FILE) 
    c = db.cursor() 
    points_now = c.execute("SELECT points FROM users WHERE username = ?", (username, )).fetchone()
    totalpoints = points_now[0] + points 
    c.execute("UPDATE users SET points=? WHERE username = ?", (totalpoints, username)) 
    db.commit()
    db.close()
 
def get_points(username): 
    db = sqlite3.connect(DB_FILE) 
    c = db.cursor() 
    points = c.execute("SELECT points FROM users WHERE username = ?", (username,)).fetchone() 
    db.commit()
    db.close() 
    return points[0] 
 
def change_high_score(username, score): 
    db = sqlite3.connect(DB_FILE) 
    c = db.cursor() 
    current_score = c.execute("SELECT highscore FROM users WHERE username = ?", (username,)).fetchone() 
    if (score > current_score[0]):
        print(score)
        c.execute("UPDATE users SET highscore=? WHERE username = ?", (score, username)) 
    db.commit()
    db.close()
    
def getTopTen():
    db = sqlite3.connect(DB_FILE)
    c = db.cursor()
    topTen = c.execute("SELECT username, highscore FROM users ORDER BY highscore DESC LIMIT 10").fetchall()
    return topTen

def getMessages():
    db = sqlite3.connect(DB_FILE)
    c = db.cursor()
    topThree = c.execute("SELECT message FROM users ORDER BY highscore DESC LIMIT 3").fetchall()
    return topThree
    
 
 #OTHER METHODS

def choose_character(username, character): 
    db = sqlite3.connect(DB_FILE) 
    c = db.cursor() 
    c.execute("UPDATE character FROM users WHERE username = ?", (character, username))
    db.close() 

def choose_music(username, music): 
    db = sqlite3.connect(DB_FILE) 
    c = db.cursor() 
    c.execute("UPDATE musicPref FROM users WHERE username = ?", (music, username)) 
    db.commit()
    db.close() 
 
def choose_message(username, message): 
    db = sqlite3.connect(DB_FILE) 
    c = db.cursor() 
    c.execute("UPDATE users SET message=? WHERE username = ?", (message, username)) 
    db.commit()
    db.close() 
 
def leaderboard(): 
    db = sqlite3.connect(DB_FILE) 
    c = db.cursor() 
    points = c.execute("SELECT username, points FROM users ORDER BY points DESC LIMIT 8").fetchall()
    messages = c.execute("SELECT username, message FROM users ORDER by points DESC LIMIT 8").fetchall() 
    db.commit()
    db.close() 
    return points, messages 
 
def add_themes(): 
    db = sqlite3.connect(DB_FILE) 
    c = db.cursor() 
    c.execute(""" 
        INSERT INTO themes VALUES  
            ('Normal', 'Green', 'Green'), 
            ('Winter', 'White', 'White') 
    """) 
    db.commit() 
    db.close() 
 
def custom_themes(username, theme, color1, color2): 
    db = sqlite3.connect(DB_FILE) 
    c = db.cursor() 
    c.execute("INSERT INTO themes (username, theme, color1, color2) VALUES (?, ?, ?, ?)", (username, theme, color1, color2)) 
    db.commit()
    db.close()

create_tables()