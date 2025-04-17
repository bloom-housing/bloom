import os
import xgboost as xgb
import numpy as np
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split

# Set random seed for reproducibility
np.random.seed(42)

# Generate mock housing data
n_samples = 1000

data = {
    "income": np.random.lognormal(mean=10.5, sigma=0.5, size=n_samples), 
    "household_size": np.random.choice(
        [1, 2, 3, 4, 5, 6], size=n_samples, p=[0.3, 0.3, 0.2, 0.1, 0.05, 0.05]
    ),
    "housing_status": np.random.choice([0, 1, 2], size=n_samples, p=[0.15, 0.6, 0.25]),  # 0: homeless, 1: renting, 2: stable
    "income_vouchers": np.random.choice([0, 1], size=n_samples, p=[0.85, 0.15]),
    "household_expecting_changes": np.random.choice([0, 1], size=n_samples, p=[0.75, 0.25]),
    "household_student": np.random.choice([0, 1], size=n_samples, p=[0.8, 0.2])
}

# Create DataFrame
df = pd.DataFrame(data)


# Generate risk labels (1: high risk, 0: low risk)
risk_score = (
    (df["income"] < 25000) * 0.35 +  # Low income increases risk
    (df["housing_status"] == 0) * 0.30 +  # Homelessness increases risk
    (df["household_size"] > 3) * 0.20 +  # Large households increase risk
    (df["income_vouchers"] == 1) * 0.15 +  # Vouchers suggest financial strain
    (df["household_expecting_changes"] == 1) * 0.15 +  # Changes add instability
    (df["household_student"] == 1) * 0.10  # Students may have unstable income
)
risk_score = np.clip(risk_score + np.random.normal(0, 0.1, n_samples), 0, 1)
df["risk"] = (risk_score > 0.5).astype(int)


# Prepare features
features = [
    "income",
    "household_size",
    "housing_status",
    "income_vouchers",
    "household_expecting_changes",
    "household_student"
]
X = df[features]
y = df["risk"]

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train XGBoost model
model = xgb.XGBClassifier(
    n_estimators=100,
    max_depth=3,
    learning_rate=0.1,
    random_state=42,
    eval_metric="logloss"
)
model.fit(X_train, y_train)

# Evaluate model
accuracy = model.score(X_test, y_test)
print(f"Model accuracy: {accuracy:.2f}")

print("Model training complete.")

# Make sure the app/ directory exists
os.makedirs("app", exist_ok=True)

# Save model into app/ folder
with open("app/model.pkl", "wb") as f:
    pickle.dump(model, f)
