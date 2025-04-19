# Progress Report - Housing Risk Prediction Model  
**Date**: April 19, 2025  

## Current Status  
- **Model**: XGBoost model trained on mock data (features: rent, income, household size). Accuracy: ~100% on mock test set. Real data training (AHS 2023 dataset) in progress.  
- **API**: Flask `model-service` with `/predict` endpoint, accepts JSON inputs (e.g., `{"rent": 1000, "income": 30000, "household_size": 2}`). Integrated with Nest.js backend via `/applications/submit`.  
- **Frontend**: Ryan developing React UI. Basic form for inputting rent, income, etc., partially connected to Nest.js API. Boolean state to trigger model execution not yet implemented.  
- **Documentation**: Model structure and `model/README.md` set up. User guide assigned to another team member, not started.  

## Feedback from Progress Presentation  
- No specific technical concerns were raised.  
- General suggestion to ensure that tables and data visualizations in the pitch deck are accurate and clearly reflect current model performance and integration status.  

## Next Steps  
- Train model on AHS 2023 data by next Friday.  
- Implement frontend boolean state and API trigger by next Wednesday.  
- Update Flask API for real data compatibility by next Friday.  
- Support user guide development (review draft by tomorrow).  

