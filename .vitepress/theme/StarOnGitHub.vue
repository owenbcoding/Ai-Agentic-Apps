<script setup lang="ts">
const repo = 'https://github.com/owenbcoding/Ai-Agentic-Apps'
</script>

<template>
  <a class="StarOnGitHub" :href="repo" target="_blank" rel="noopener">
    Star on
  </a>
</template>

<style scoped>
.StarOnGitHub {
  display: none;
}

@media (min-width: 1280px) {
  .StarOnGitHub {
    display: flex;
    align-items: center;
    padding: 0 12px;
    line-height: var(--vp-nav-height);
    font-size: 14px;
    font-weight: 500;
    color: var(--vp-c-text-1);
    transition: color 0.25s;
  }
}

.StarOnGitHub:hover {
  color: var(--vp-c-brand-1);
}
</style>
