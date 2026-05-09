# 04 - Regression Use Cases

## Notes

- Regression predicts continuous numeric values (not categories).
- Use regression when the target is a number such as:
  - Revenue
  - Sales
  - Demand
  - Price
  - Time to completion
- In bootcamp-style projects, regression supports forecasting and business planning tasks.
- Regional sales analysis can include regression to estimate future regional performance.
- Regression outputs can be used inside agentic workflows to trigger decisions:
  - If projected sales drop below threshold -> trigger campaign plan.
  - If forecasted churn-risk value rises -> trigger retention workflow.
- Python-based pipelines are common, but low-code/no-code dashboards can still consume regression outputs.

## Key Points

- Use regression when your target variable is numeric and continuous.
- Common workflow:
  - Define target value
  - Engineer features
  - Split train/validation/test
  - Train model
  - Evaluate errors
  - Deploy and monitor drift
- Important metrics:
  - MAE (average absolute error)
  - MSE/RMSE (penalizes larger errors more strongly)
  - R-squared (explained variance)
- Strong baselines matter:
  - Mean predictor baseline
  - Simple linear regression baseline
- Better business outcomes come from combining:
  - Accurate forecasts (regression)
  - Automated execution (agentic AI)

## Examples

- Sales Forecasting: predict next month revenue by region or product line.
- Dynamic Pricing: predict optimal price range based on demand, seasonality, and competition.
- Delivery Time Estimation: predict estimated completion or shipping time for operations teams.
- Marketing ROI Prediction: predict expected return for campaigns before launch.
- Crypto Trend Estimation: predict short-term price movement range as a continuous value.
- Customer Lifetime Value (CLV): predict long-term customer value for retention planning.

## Questions

- How do I decide whether a business problem needs regression or classification?
- Which regression metric should I prioritize for forecasting: MAE, RMSE, or R-squared?
- How can I reduce overfitting in regression models?
- What baseline should I always compare against before using advanced models?
- How do I combine regression predictions with an agentic AI system to automate actions?
- In interviews, how should I explain feature engineering and error analysis for regression projects?
