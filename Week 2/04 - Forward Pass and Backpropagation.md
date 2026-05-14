# 04 - Forward Pass and Backpropagation

## Notes

- Forward pass is the process where input data moves through each layer of the neural network to produce a prediction.
- At each layer, the model computes:
  - `z = W*x + b`
  - activation `a = f(z)`
- The final output is compared with the true label/value using a loss function.
- Backpropagation is the process of computing how much each weight contributed to the error.
- It uses the chain rule from calculus to move backward from output layer to earlier layers.
- After gradients are computed, an optimizer (like SGD or Adam) updates the weights to reduce loss.
- Training loop in simple sequence:
  - Forward pass
  - Loss calculation
  - Backward pass (gradient calculation)
  - Parameter update
  - Repeat for many batches/epochs
- Intuition:
  - Forward pass = "make a guess"
  - Backprop = "learn from mistake"

## Key Points

- Forward pass answers: "What prediction does current model make?"
- Backpropagation answers: "How should each parameter change to improve prediction?"
- Gradients indicate direction and sensitivity:
  - Positive gradient -> decrease weight (for gradient descent)
  - Negative gradient -> increase weight
- Learning rate controls update size:
  - Too high -> unstable training/divergence
  - Too low -> very slow learning
- Loss should generally trend downward during healthy training, but short-term fluctuations are normal with mini-batches.
- Common practical issues:
  - Vanishing gradients in deep networks (very small updates)
  - Exploding gradients (very large updates)
- Typical fixes include:
  - Better initialization
  - ReLU-like activations
  - Batch normalization
  - Gradient clipping (for exploding gradients)

## Examples

- Binary classification mini example:
  1. Input: customer features go through network.
  2. Forward pass outputs churn probability (for example `0.78`).
  3. True label is `1` (customer churned), so loss is computed.
  4. Backprop computes gradients for each layer.
  5. Optimizer updates weights so next prediction is closer to truth.
- Regression mini example:
  1. Model predicts next-month sales = `120k`.
  2. Actual sales = `100k`.
  3. MSE loss captures the error.
  4. Backprop identifies which parameters caused overestimation.
  5. Weight updates reduce future error.
- Agentic AI context example:
  - A model that scores ticket urgency can be retrained via forward/backprop cycles.
  - The agent then uses improved scores to prioritize and route tickets automatically.

## Questions

- Why do we need both forward pass and backpropagation instead of just one step?
- How exactly does the chain rule apply across multiple hidden layers?
- What signs indicate vanishing or exploding gradients during training?
- How should I choose a learning rate for stable and faster convergence?
- What is the difference between gradient descent, SGD, and Adam in practice?
- In interviews, how can I explain backpropagation without writing heavy equations?
