import { configure } from '@storybook/angular'

// automatically import all files ending in *.stories.ts
const ctx = require.context('../src/stories', true, /\.stories\.ts$/)

function loadStories() {
  ctx.keys().forEach(filename => ctx(filename))
}

configure(loadStories, module)
