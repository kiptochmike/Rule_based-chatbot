from flask import Flask, request, jsonify, render_template
import pandas as pd

app = Flask(__name__)

# Load the dataset
df = pd.read_csv('sales.csv')

def get_tyres_stock(tyre_type):
    if tyre_type and tyre_type in df['tyretype'].values:
        result = df[df['tyretype'].str.lower() == tyre_type.lower()]
        stock_sum = result['stock'].sum()
        return int(stock_sum)
    else:
        return "No stock information available for the specified tyre type."

def get_product_info(product_name):
    if product_name:
        result = df[df['ProductName'].str.lower() == product_name.lower()]
        if not result.empty:
            return result['productinfo'].values[0]
    return "Product not found."

def extract_product_name(user_input):
    products = df['ProductName'].unique()
    for product in products:
        if product.lower() in user_input.lower():
            return product
    return None

def extract_tyre_type(user_input):
    tyre_types = df['tyretype'].unique()
    for tyre_type in tyre_types:
        if tyre_type.lower() in user_input.lower():
            return tyre_type
    return None

def handle_request(user_input):
    user_input = user_input.lower()
    
    if "stock" in user_input:
        tyre_type = extract_tyre_type(user_input)
        stock = get_tyres_stock(tyre_type)
        return str(stock)
    
    elif "productinfo" in user_input:
        product_name = extract_product_name(user_input)
        return get_product_info(product_name)
    
    elif "sales" in user_input:
        return "How can I assist with your sales order? For example, check order status or process an order."
    
    else:
        return "Sorry, I didn't understand that. Can you please rephrase your question?"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    try:
        user_input = request.form['user_input']
        response = handle_request(user_input)
        return jsonify({'response': response})
    except Exception as e:
        return jsonify({'response': str(e)})

if __name__ == '__main__':
    app.run(debug=True)