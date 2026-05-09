# 03 - Classification Use Cases

## Notes

- Classification predicts categories (labels) rather than continuous numeric values.
- In AI projects, classification is used when the output is a class such as:
  - Yes/No
  - Fraud/Not fraud
  - Churn/Not churn
  - Spam/Not spam
- Classification can be binary (2 classes) or multi-class (3+ classes).
- From course-aligned project ideas, customer churn prediction is a core classification use case.
- Classification outputs can be used by agentic workflows to trigger actions automatically.
- Real-world business value: faster decisions, risk detection, customer retention, and automation of repetitive triage tasks.

## Key Points

- Use classification when your target variable is categorical.
- Data quality and label quality heavily impact model performance.
- Typical pipeline:
  - Define labels
  - Collect and clean data
  - Train/validate model
  - Set threshold for decisioning
  - Deploy and monitor performance drift
- Evaluation metrics to focus on:
  - Accuracy (overall correctness)
  - Precision (how many predicted positives are correct)
  - Recall (how many actual positives are detected)
  - F1-score (balance between precision and recall)
- In business contexts, optimize the metric that matches cost:
  - High false negatives -> prioritize recall
  - High false positives -> prioritize precision

## Examples

- Customer Churn Prediction: classify customers as likely to churn or likely to stay.
- Loan Approval Screening: classify applications as approve, review, or reject.
- Support Ticket Routing: classify incoming tickets by issue type and urgency.
- Fraud Detection: classify transactions as suspicious or normal.
- Lead Qualification: classify leads as high, medium, or low conversion potential.
- Email Filtering: classify messages as spam, promotions, or primary.

## Questions

- How do I decide whether a problem is classification or regression?
- Which classification metric should I prioritize for customer churn use cases?
- How do I handle class imbalance when one class is rare?
- What is a good baseline model before trying advanced models?
- How can I combine a classification model with an agentic AI workflow?
- In interviews, how deeply should I explain precision, recall, ROC-AUC, and threshold tuning?
