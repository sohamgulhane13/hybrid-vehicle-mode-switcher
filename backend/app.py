# Flask backend placeholder
# app.py - Flask backend with SQLite database
from flask import Flask, render_template, jsonify, request # type: ignore
import sqlite3
import json
from datetime import datetime
import os

app = Flask(__name__)

# Database setup
DATABASE = 'hybrid_vehicle.db'

def init_database():
    """Initialize the SQLite database with required tables"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS vehicle_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            battery_level INTEGER NOT NULL,
            speed INTEGER NOT NULL,
            acceleration INTEGER NOT NULL,
            mode TEXT NOT NULL,
            efficiency INTEGER NOT NULL
        )
    ''')
    
    conn.commit()
    conn.close()

@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')

@app.route('/save_data', methods=['POST'])
def save_data():
    """Save vehicle data to database"""
    try:
        data = request.get_json()
        
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO vehicle_records 
            (battery_level, speed, acceleration, mode, efficiency, timestamp)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            data['battery_level'],
            data['speed'],
            data['acceleration'],
            data['mode'],
            data['efficiency'],
            data['timestamp']
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({'success': True})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/get_records')
def get_records():
    """Retrieve all records from database"""
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, timestamp, battery_level, speed, acceleration, mode, efficiency
            FROM vehicle_records
            ORDER BY timestamp DESC
            LIMIT 50
        ''')
        
        records = []
        for row in cursor.fetchall():
            records.append({
                'id': row[0],
                'timestamp': row[1],
                'battery_level': row[2],
                'speed': row[3],
                'acceleration': row[4],
                'mode': row[5],
                'efficiency': row[6]
            })
        
        conn.close()
        
        return jsonify({'records': records})
    
    except Exception as e:
        return jsonify({'records': [], 'error': str(e)})

@app.route('/get_analytics')
def get_analytics():
    """Get analytics data for charts"""
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Get mode distribution
        cursor.execute('''
            SELECT mode, COUNT(*) as count
            FROM vehicle_records
            GROUP BY mode
        ''')
        
        mode_distribution = dict(cursor.fetchall())
        
        # Get average efficiency by mode
        cursor.execute('''
            SELECT mode, AVG(efficiency) as avg_efficiency
            FROM vehicle_records
            GROUP BY mode
        ''')
        
        efficiency_by_mode = dict(cursor.fetchall())
        
        # Get recent mode switches
        cursor.execute('''
            SELECT timestamp, mode
            FROM vehicle_records
            ORDER BY timestamp DESC
            LIMIT 20
        ''')
        
        recent_switches = cursor.fetchall()
        
        conn.close()
        
        return jsonify({
            'mode_distribution': mode_distribution,
            'efficiency_by_mode': efficiency_by_mode,
            'recent_switches': recent_switches
        })
    
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    init_database()
    app.run(debug=True)