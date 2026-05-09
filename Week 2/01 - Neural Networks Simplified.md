# 01 - Neural Networks Simplified

## Notes

- A neural network is a machine learning model inspired by how neurons in the brain pass signals.
- It learns patterns by adjusting weights through training data.
- Basic structure:
  - Input layer: receives features
  - Hidden layers: learn intermediate patterns
  - Output layer: produces final prediction
- Each neuron applies:
  - Weighted sum of inputs
  - Bias term
  - Activation function (such as ReLU or sigmoid)
- During training, the model compares predictions with actual answers and reduces error using backpropagation and gradient descent.
- Neural networks are powerful for complex patterns in text, images, audio, and tabular data.

## Key Points

- Neural networks are useful when relationships are non-linear and hard to model with simple rules.
- More data and better feature quality usually improve performance.
- Core training concepts:
  - Epoch: one full pass through training data
  - Batch size: number of samples processed before updating weights
  - Learning rate: step size for weight updates
- Common risks:
  - Overfitting (good on training, weak on new data)
  - Underfitting (model too simple to learn pattern)
- Mitigation techniques:
  - Train/validation/test split
  - Regularization and dropout
  - Early stopping
- Practical mindset: start simple, establish a baseline, then increase complexity.

## Examples

- Customer Churn Prediction: classify whether a customer will churn based on usage and behavior signals.
- Sales Forecasting: predict future revenue using historical trends and seasonality features.
- Support Ticket Intent Detection: classify incoming support requests by type for faster routing.
- Document Q&A Pipeline: use embeddings/neural models to retrieve relevant chunks before generating answers.
- Image Classification: detect categories (for example product defect vs no defect) from images.
- Lead Scoring: predict likelihood of conversion for sales prioritization.

## Questions

- When should I use a neural network instead of simpler models like logistic regression or random forests?
- How many hidden layers are enough for a beginner project?
- Which activation function should I use and why?
- How do I detect and fix overfitting in neural network training?
- What is the difference between loss function and evaluation metric?
- In interviews, how should I explain backpropagation in simple terms?
