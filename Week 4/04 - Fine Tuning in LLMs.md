# 04 - Fine Tuning in LLMs

## Notes

- **Fine-tuning** is the process of continuing to train a pre-trained LLM on a smaller, task-specific dataset to adapt its behaviour, knowledge, or style.
- The base model has already learned general language understanding from massive pre-training data; fine-tuning steers that knowledge toward a specific goal.
- Think of pre-training as giving a person a broad education, and fine-tuning as specialised on-the-job training.

### Why Fine-Tune?

- Teach the model a specific **format** (e.g. always return JSON, follow a particular report template).
- Improve performance on a **narrow domain** (e.g. medical notes, legal contracts, customer support scripts).
- Reduce **prompt length** — a fine-tuned model may need fewer examples in the prompt to behave correctly.
- Embed **company-specific knowledge** or tone into the model weights.
- Improve **safety / refusals** for a specific deployment context.

### Types of Fine-Tuning

#### 1. Full Fine-Tuning
- All model weights are updated during training.
- Most expensive: requires full GPU memory for all parameters.
- Highest risk of **catastrophic forgetting** (the model forgets general capabilities).
- Rarely used for LLMs due to cost; more common for smaller specialised models.

#### 2. Instruction Tuning
- Fine-tune on a dataset of (instruction, response) pairs.
- Teaches the model to follow human instructions rather than just predict the next token.
- How GPT-4, Claude, and Llama-Instruct variants were created from their base models.

#### 3. LoRA (Low-Rank Adaptation)
- Instead of updating all weights, LoRA adds small **low-rank matrices** (A and B) to each layer.
- Only the new matrices are trained — the original weights are frozen.
- Reduces trainable parameters by ~99%, meaning fine-tuning fits on a single consumer GPU.
- The adapted weights can be "merged" back into the base model or loaded separately as an adapter.

```text
Original weight: W  (frozen)
LoRA update: W' = W + A·B   (A and B are small low-rank matrices, trained)
```

#### 4. QLoRA (Quantised LoRA)
- Combines LoRA with 4-bit quantisation of the base model.
- Makes fine-tuning a 7B or 13B model possible on a single 24GB GPU (e.g. RTX 3090).
- Introduced by Dettmers et al. (2023) — democratised open-source fine-tuning.

#### 5. RLHF (Reinforcement Learning from Human Feedback)
- Used to align a model with human preferences (not just correct format, but *good* answers).
- Three-stage process:
  1. **SFT (Supervised Fine-Tuning)**: fine-tune on human-written demonstrations.
  2. **Reward model training**: train a model to predict which response humans prefer.
  3. **PPO (Proximal Policy Optimisation)**: use the reward model to further train the LLM via RL.
- How ChatGPT and Claude were made helpful and safe.

#### 6. DPO (Direct Preference Optimisation)
- A simpler alternative to RLHF that skips the reward model entirely.
- Train directly on (preferred, rejected) response pairs.
- Cheaper and more stable than PPO; increasingly popular for open-source alignment.

### Fine-Tuning Data

- Quality > Quantity. 1,000 high-quality, diverse examples often beat 100,000 noisy ones.
- Data should match the **exact format** you want at inference time.
- Common formats: JSONL with `{"instruction": "...", "output": "..."}` pairs.
- Watch for **data leakage** (test examples accidentally in training set) and **bias amplification**.

### Fine-Tuning vs RAG

| | Fine-Tuning | RAG |
|---|---|---|
| Knowledge updatable | Hard (retrain) | Easy (re-index) |
| Teaches new format/style | Yes | No |
| Prevents hallucination | Partially | Partially |
| Requires labelled data | Yes | No (just documents) |
| Inference latency | No overhead | Adds retrieval step |
| Interpretable | No | Yes (can cite sources) |

- Best practice: **use RAG first** — it's cheaper and faster. **Fine-tune if** prompt engineering and RAG are insufficient.

### Tools and Frameworks

- **Hugging Face Transformers + PEFT**: standard library for LoRA/QLoRA fine-tuning.
- **Axolotl**: opinionated fine-tuning framework, supports QLoRA out of the box.
- **Unsloth**: fast fine-tuning with optimised CUDA kernels — 2× speed-up.
- **OpenAI fine-tuning API**: pay-per-token fine-tuning of GPT-3.5/GPT-4 via API.
- **Together AI / Replicate**: managed fine-tuning of open-source models.

### Evaluating Fine-Tuned Models

- Compare on a **held-out test set** with the same format as training data.
- Use **human evaluation** for subjective quality (tone, helpfulness).
- Check for **regression** on general benchmarks (MMLU, HumanEval) to detect catastrophic forgetting.
- Log training loss curves — if validation loss diverges from training loss, the model is overfitting.

## Key Points

- Fine-tuning adapts a pre-trained LLM to a specific task or style without training from scratch.
- **LoRA / QLoRA** has democratised fine-tuning — 7B models can be fine-tuned on a single consumer GPU.
- **RLHF / DPO** are used for alignment (making models helpful, harmless, and honest).
- Data quality is the biggest lever — more data is not always better.
- Fine-tuning is not a replacement for RAG; they solve different problems and are often combined.
- Always evaluate for catastrophic forgetting after fine-tuning on narrow data.

## Examples

- **Format fine-tuning**: fine-tune a model on (query → SQL query) pairs so it always outputs valid SQL without needing a lengthy system prompt.
- **Tone fine-tuning**: fine-tune a model on your brand's historical emails so it writes in your company's voice.
- **Medical domain**: fine-tune Llama 3 on clinical notes so it understands medical abbreviations and discharge summary formats.
- **LoRA in practice**: use Axolotl + QLoRA to fine-tune Mistral 7B on a custom dataset on a single RTX 3090 in ~4 hours.
- **RLHF in practice**: OpenAI fine-tuned GPT-3 with human feedback → InstructGPT → ChatGPT.

## Questions

- What is catastrophic forgetting and how does LoRA help avoid it?
- How does LoRA achieve a ~99% reduction in trainable parameters while still adapting the model effectively?
- What is the difference between RLHF and DPO, and why is DPO often preferred for open-source alignment?
- When should you choose fine-tuning over prompt engineering or RAG, and how do you make that decision?
- What does a good fine-tuning dataset look like — what makes a training example high quality?
- How do you detect and prevent overfitting during fine-tuning?
- What benchmarks would you use to check that a fine-tuned model hasn't lost general capabilities?

