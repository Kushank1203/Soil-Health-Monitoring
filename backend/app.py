from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import joblib
import numpy as np

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# Load the pre-trained CatBoost model
try:
    model = joblib.load('CatBoost_best_model.pkl')
    print("CatBoost model loaded successfully!")
except Exception as e:
    print(f"Error loading CatBoost model: {e}")
    model = None

# Database connection
try:
    conn = psycopg2.connect(
        dbname="soil_health",
        user="postgres",
        password="dumbo@2711vk",
        host="localhost"
    )
    print("Database connection established!")
except Exception as e:
    print(f"Error connecting to the database: {e}")
    conn = None

# Function to classify soil health
def classify_soil_health(ph, n, p, k):
    if ph < 5.5 or ph > 8 or n < 20 or p < 20 or k < 20:
        return "Poor"
    elif 5.5 <= ph <= 7.5 and n >= 20 and p >= 20 and k >= 20:
        return "Good"
    else:
        return "Moderate"

# Function to predict soil health and recommend a crop
def predict_soil_and_crop(ph, humidity, temp, n, p, k, rainfall):
    if model is None:
        raise Exception("CatBoost model is not loaded.")

    # Prepare input data for prediction
    input_data = np.array([[ph, humidity, temp, n, p, k, rainfall]])

    # Predict the best crop
    predicted_crop = model.predict(input_data).tolist()[0]  # Convert ndarray to a single value

    # Determine soil health
    soil_health = classify_soil_health(ph, n, p, k)

    return {
        "Soil Health": soil_health,
        "Recommended Crop": predicted_crop
    }

@app.route("/")
def home():
    return jsonify({"message": "Soil Health Monitoring API is running!"})

@app.route('/api/data', methods=['GET'])
def get_data():
    """Fetch the latest soil data from the database."""
    if conn is None:
        print("Database connection failed")  # Log database connection error
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cur = conn.cursor()
        cur.execute("SELECT * FROM soil_data ORDER BY timestamp DESC LIMIT 10")
        data = cur.fetchall()
        cur.close()
        print("Fetched data:", data)  # Log fetched data
        return jsonify(data)
    except Exception as e:
        print(f"Error in /api/data: {e}")  # Log the error
        return jsonify({"error": str(e)}), 500

@app.route("/predict", methods=["POST"])
def predict():
    """Generate AI-based insights and crop recommendations."""
    try:
        data = request.get_json()

        # Validate input parameters
        required_params = ["ph", "humidity", "temperature", "nitrogen", "phosphorus", "potassium", "rainfall"]
        for param in required_params:
            if param not in data:
                return jsonify({"error": f"Missing parameter: {param}"}), 400

        # Extract values
        n = float(data["nitrogen"])
        p = float(data["phosphorus"])
        k = float(data["potassium"])
        ph = float(data["ph"])
        temp = float(data["temperature"])
        humidity = float(data["humidity"])
        rainfall = float(data["rainfall"])

        # Get prediction
        result = predict_soil_and_crop(ph, humidity, temp, n, p, k, rainfall)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/insights', methods=['POST'])
def get_insights():
    """Generate AI-based insights using the CatBoost model."""
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 415  # Unsupported Media Type

    try:
        soil_data = request.get_json()  # Parse JSON data
        print("Received data:", soil_data)

        # Validate input parameters
        required_params = ["ph", "humidity", "temperature", "nitrogen", "phosphorus", "potassium", "rainfall"]
        for param in required_params:
            if param not in soil_data:
                print(f"Missing parameter: {param}")
                return jsonify({"error": f"Missing parameter: {param}"}), 400

        # Insert data into the database
        if conn is not None:
            cur = conn.cursor()
            try:
                cur.execute(
                    "INSERT INTO soil_data (ph, humidity, temperature, nitrogen, phosphorus, potassium, rainfall) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                    (
                        soil_data['ph'],
                        soil_data['humidity'],
                        soil_data['temperature'],
                        soil_data['nitrogen'],
                        soil_data['phosphorus'],
                        soil_data['potassium'],
                        soil_data['rainfall']
                    )
                )
                conn.commit()  # Commit the transaction
                print("Data inserted into the database.")
            except Exception as e:
                conn.rollback()  # Roll back the transaction on error
                print(f"Error inserting data into the database: {e}")
                return jsonify({"error": str(e)}), 500
            finally:
                cur.close()  # Always close the cursor

        # Prepare input for the model
        input_data = [
            soil_data['ph'],
            soil_data['humidity'],
            soil_data['temperature'],
            soil_data['nitrogen'],
            soil_data['phosphorus'],
            soil_data['potassium'],
            soil_data['rainfall']
        ]
        print("Input data for prediction:", input_data)

        # Predict using the CatBoost model
        prediction = model.predict([input_data]).tolist()[0]  # Convert ndarray to a single value
        print("Prediction:", prediction)

        # Generate recommendations
        insights = {
            "predicted_yield": prediction,
            "recommendation": "Add organic compost to improve nitrogen levels."
        }
        return jsonify(insights)
    except Exception as e:
        print(f"Error in /api/insights: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)