from flask import Flask, request, jsonify, render_template
import pandas as pd
from datetime import datetime

app = Flask(__name__)

# Load the CSV file
df = pd.read_csv('stock sheet.csv')

# Clean column names by stripping extra spaces
df.columns = df.columns.str.strip()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['GET'])
def search():
    item_description = request.args.get('item_description')
    if not item_description:
        return jsonify({'error': 'No search term provided'})

    # Search for all rows that contain the item description or size
    item_rows = df[df['Item Description'].str.contains(item_description, case=False, na=False)]
    
    if not item_rows.empty:
        results = []
        for _, item_info in item_rows.iterrows():
            result = {
                'Brand': item_info['Brand'] if pd.notna(item_info['Brand']) else 'N/A',
                'TyrePattern': item_info['Tyre Pattern'] if pd.notna(item_info['Tyre Pattern']) else 'N/A',
                'HeadOffice': item_info['HeadOffice'] if pd.notna(item_info['HeadOffice']) else 'N/A',
                'Mombasa': item_info['Mombasa'] if pd.notna(item_info['Mombasa']) else 'N/A',
                'MSA Road': item_info['MSA Road'] if pd.notna(item_info['MSA Road']) else 'N/A',
                'Total': int(item_info['Total']) if pd.notna(item_info['Total']) else 'N/A',
                'ListPrice': float(item_info['List Price'].replace(',', '')) if pd.notna(item_info['List Price']) else 'N/A',
                'Timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            results.append(result)
        return jsonify(results)
    else:
        return jsonify({'error': 'No items found'})

if __name__ == '__main__':
    app.run(debug=True)
