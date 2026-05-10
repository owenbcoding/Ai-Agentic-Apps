# 02 - What are CNNs

## Notes

- CNN stands for Convolutional Neural Network, a deep learning model mainly used for image and visual data.
- CNNs are designed to automatically learn visual features like edges, textures, shapes, and objects.
- Instead of reading an image as one long list, CNNs preserve spatial structure (height, width, channels).
- Main building blocks:
  - Convolution layers (feature extraction)
  - Activation functions like ReLU (non-linearity)
  - Pooling layers (downsampling and noise reduction)
  - Fully connected layers (final prediction)
- Early layers learn simple patterns (edges), deeper layers learn complex patterns (object parts and full objects).
- CNNs reduce manual feature engineering because they learn useful visual features directly from data.

## Key Points

- CNNs work best when local patterns matter, especially in images and videos.
- Convolution uses filters/kernels that slide across an image to detect specific patterns.
- Pooling helps reduce computation and overfitting by compressing feature maps.
- Typical CNN workflow:
  - Input image
  - Stacked convolution + activation + pooling layers
  - Flatten/Global pooling
  - Dense output layer for classification or regression
- Common training considerations:
  - Data augmentation improves generalization
  - Normalization and proper batch size improve stability
  - Overfitting is handled with dropout, regularization, and early stopping
- Transfer learning (using pretrained models) is often the fastest path for real-world projects.

## Examples

- Image Classification: classify cats vs dogs, or different product categories.
- Medical Imaging: detect possible pneumonia in chest X-rays.
- Manufacturing Quality Check: detect product defects from camera images.
- Face Recognition Pipeline: identify or verify a person from facial images.
- Traffic Sign Detection: classify road signs for autonomous driving systems.
- Document Processing: detect and classify elements in scanned forms or IDs.

## Questions

- Why are CNNs better than plain neural networks for image tasks?
- What is the difference between convolution and pooling?
- How do kernel size, stride, and padding affect output feature maps?
- When should I use transfer learning instead of training a CNN from scratch?
- How do I know if my CNN is overfitting, and what should I do first to fix it?
- In interviews, how can I explain convolution intuitively without heavy math?
