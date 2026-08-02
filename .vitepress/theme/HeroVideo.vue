<script setup lang="ts">
import { withBase } from 'vitepress'
</script>

<template>
  <video
    class="hero-video"
    :src="withBase('/A-nural-network-video.mp4')"
    autoplay
    loop
    muted
    playsinline
    preload="auto"
    aria-label="Animated neural network"
  />
</template>

<style scoped>
.hero-video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 192px;
  height: 192px;
  object-fit: cover;
  border-radius: 50%;
  /* fades the video's own edges into the page background so it reads as
     part of the hero rather than a video pasted on top of it */
  -webkit-mask-image: radial-gradient(circle, #000 62%, transparent 100%);
  mask-image: radial-gradient(circle, #000 62%, transparent 100%);
  box-shadow: 0 0 0 1px var(--vp-c-brand-soft);
}

@media (min-width: 640px) {
  .hero-video {
    width: 256px;
    height: 256px;
  }
}

@media (min-width: 960px) {
  .hero-video {
    width: 320px;
    height: 320px;
  }
}
</style>
