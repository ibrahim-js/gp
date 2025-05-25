import csv
import psycopg2

# Database connection config
DB_CONFIG = {
    'dbname': 'testgp',
    'user': 'postgres',
    'password': 'password',
    'host': 'localhost',  # or your server IP
    'port': 5432
}

CSV_FILE_PATH = 'project_projects.csv'  # Update this path to your CSV file

def convert_value(value):
    if value is None or value.strip() == '' or value.strip().upper() == 'NULL':
        return None
    return value

conn = psycopg2.connect(**DB_CONFIG)
cur = conn.cursor()

with open(CSV_FILE_PATH, newline='', encoding='utf-8') as csvfile:
    reader = csv.reader(csvfile)
    columns = next(reader)  # header row
    quoted_columns = [f'"{col}"' for col in columns]

    for row in reader:
        cleaned_row = [convert_value(cell) for cell in row]
        placeholders = ', '.join(['%s'] * len(cleaned_row))
        query = f"INSERT INTO projets ({', '.join(quoted_columns)}) VALUES ({placeholders})"
        cur.execute(query, cleaned_row)

conn.commit()
cur.close()
conn.close()

print("✅ Data inserted successfully.")
