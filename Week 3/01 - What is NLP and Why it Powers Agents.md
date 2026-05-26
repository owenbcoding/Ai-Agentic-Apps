# 01 - What is NLP and Why it Powers Agents

NLP Basics:
- NLP = Natural Language Processing (how computers understand and work with text).
- Related AI areas: ML (Machine Learning), CV (Computer Vision), and AV (Audio/Voice).
- Example: "Robert is walking."
  - "Robert" = noun
  - "is walking" = verb/action
- Computers convert text into numeric form (vectors) so algorithms can process it.
- Source text -> target representation.

## Important Points
- Tokenization
- Stemming
- Lemmatization
- POS tagging (Part-of-Speech tagging)
- Stop-word removal
- Vectorization
- Embeddings (numeric vectors that capture meaning)

## Notes
- Stop words are very common words (for example: "the", "is", "and") that are often removed.
- Stemming is faster but rougher; lemmatization is cleaner and dictionary-based.

## Key Points
- NLP is the bridge between human language and machine understanding.
- Most NLP pipelines start with cleaning + tokenization, then feature creation (vectorization/embeddings).

## Examples
- "Robert is walking in the park."
  - Tokens: ["Robert", "is", "walking", "in", "the", "park"]
  - After stop-word removal (example): ["Robert", "walking", "park"]
  - Lemma example: "walking" -> "walk"

## Questions
- When should we use stemming vs lemmatization?
- What is the difference between vectorization and embeddings?
