# itWorksOnMyMachine -
# SoftDev
# P04
# 2025-4-2
# time spent: 5 hrs

import sqlite3
import csv
import os
import json

DB_FILE = "user.db"

# Function to create a new database connection per request (Flask-friendly)
def get_db():
    db = sqlite3.connect(DB_FILE, check_same_thread=False)
    return db

def add_account(username, password):
    try:
        db = get_db()
        cur = db.cursor()
        cur.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
    except sqlite3.Error as e:
        print(f"Database error: {e}")
    finally:
        cur.close()
        db.commit()
        db.close()

def get_user(column, value):
    db = get_db()
    cur = db.cursor()
    try:
        query = f'SELECT * FROM users WHERE {column} = ?'
        cur.execute(query, (value,))
        user = cur.fetchone()
    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
        user = None
    finally:
        cur.close()
        db.commit()
        db.close()
    return user

def add_landmark(name, country, description, latitude, longitude):
    try:
        db = get_db()
        cur = db.cursor()
        cur.execute("INSERT INTO landmarks (name, country, description, latitude, longitude) VALUES (?, ?, ?, ?, ?)",
                    (name, country, description, latitude, longitude))
    except sqlite3.Error as e:
        print(f"Database error: {e}")
    finally:
        cur.close()
        db.commit()
        db.close()
        
def get_landmark():
    try:
        db = get_db()
        cur = db.cursor()
        cur.execute("SELECT id, name, country, description, latitude, longitude FROM landmarks")
        rows = cur.fetchall()
        landmarks = [
            {
                "id": row[0],
                "name": row[1],
                "country": row[2],
                "description": row[3],
                "latitude": row[4],
                "longitude": row[5]
            }
            for row in rows
        ]
        return landmarks
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return []
    finally:
        cur.close()
        db.close()

def get_landmark_by_country(country):
    try:
        db = get_db()
        cur = db.cursor()
        cur.execute("SELECT id, name, country, description, latitude, longitude FROM landmarks WHERE LOWER(country) = LOWER(?)", (country,))
        rows = cur.fetchall()
        landmarks = [
            {
                "id": row[0],
                "name": row[1],
                "country": row[2],
                "description": row[3],
                "latitude": row[4],
                "longitude": row[5]
            }
            for row in rows
        ]
        return landmarks
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return []
    finally:
        cur.close()
        db.close()

def is_empty():
    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT COUNT(*) FROM landmarks")
    count = cur.fetchone()[0]
    cur.close()
    db.close()
    return count == 0

def add_favorite(username, landmark_id):
    db = get_db()
    cur = db.cursor()
    cur.execute("INSERT OR IGNORE INTO favorites (username, landmark_id) VALUES (?, ?)", (username, landmark_id))
    db.commit()
    cur.close()
    db.close()

def remove_favorite(username, landmark_id):
    db = get_db()
    cur = db.cursor()
    cur.execute("DELETE FROM favorites WHERE username = ? AND landmark_id = ?", (username, landmark_id))
    db.commit()
    cur.close()
    db.close()

def get_user_favorites(username):
    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT landmark_id FROM favorites WHERE username = ?", (username,))
    rows = cur.fetchall()
    cur.close()
    db.close()
    return set(row[0] for row in rows)



# Makes tables in the database (run this once, or after changes)
def makeDb():
    db = get_db()
    c = db.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS users (
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        );
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS landmarks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            country TEXT NOT NULL,
            description TEXT NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL
        );
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS favorites (
            username TEXT NOT NULL,
            landmark_id INTEGER NOT NULL,
            PRIMARY KEY (username, landmark_id)
        );
    """)
    db.commit()
    db.close()

if __name__ == "__main__":
    makeDb()
