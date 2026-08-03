import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import HeroVideo from './HeroVideo.vue'
import StarOnGitHub from './StarOnGitHub.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h(HeroVideo),
      // Rendered after the appearance toggle + social links in the DOM;
      // custom.css reorders it (via flexbox `order`) to sit between them.
      'nav-bar-content-after': () => h(StarOnGitHub),
      'nav-screen-content-after': () => h(StarOnGitHub),
    }),
}
