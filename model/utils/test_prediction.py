import requests

url = "http://localhost:5000/predict"

payload = {
    "features": {
        "income": 30000,
        "household_size": 2,
        "housing_status": 1,
        "income_vouchers": 0,
        "household_expecting_changes": 1,
        "household_student": 0
    }
}

response = requests.post(url, json=payload)

print("Status Code:", response.status_code)
print("Response JSON:", response.json())
