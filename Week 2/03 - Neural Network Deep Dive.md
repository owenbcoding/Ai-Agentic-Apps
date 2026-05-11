# 03 - Neural Network Deep Dive

## Notes

- A neural network is a stack of layers that learns a mapping from inputs to outputs by adjusting weights and biases.
- Each neuron computes: weighted sum + bias, then applies a non-linear activation function.
- Non-linearity (ReLU, sigmoid, tanh) is what lets deep networks learn complex patterns.
- Training usually happens with:
  - Forward pass (compute predictions)
  - Loss computation (measure error)
  - Backpropagation (compute gradients)
  - Optimizer step (update parameters)
- Common loss functions:
  - Binary cross-entropy for binary classification
  - Categorical cross-entropy for multi-class classification
  - Mean squared error (MSE) for regression
- Gradient descent variants:
  - SGD: simple, noisier updates
  - Momentum: smoother, faster in valleys
  - Adam: adaptive learning rates, strong default choice

## Key Points

- Deeper models can represent richer functions, but are harder to optimize.
- Initialization matters: poor initialization can cause vanishing/exploding gradients.
- Learning rate is critical: too high diverges, too low learns very slowly.
- Overfitting happens when training performance improves but validation performance worsens.
- Regularization tools include dropout, L2 weight decay, data augmentation, and early stopping.
- Batch normalization helps stabilize training and can speed up convergence.

## Examples

- Mini binary classification flow:
  1. Input features `x` pass through hidden layers.
  2. Final layer outputs probability `p(y=1|x)`.
  3. Compute binary cross-entropy loss.
  4. Backprop computes gradients for every parameter.
  5. Adam updates parameters to reduce loss.
- If model memorizes training data:
  - Add dropout (for example 0.3)
  - Use early stopping on validation loss
  - Increase data or apply augmentation
  - Reduce model size if still overfitting

## Questions

- Why do we need non-linear activations between linear layers?
- What signals that a model is overfitting, and how would I fix it first?
- How does batch size affect gradient noise and convergence?
- When should I prefer Adam vs SGD with momentum?
- What is the difference between vanishing and exploding gradients?
