import { configure } from '@storybook/vue';

function loadStories() {
  const req = require.context('../stories', true, /\.stories\.[jt]s$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
