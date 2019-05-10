import '@storybook/addon-a11y/register'
import '@storybook/addon-actions/register'
import '@storybook/addon-console'
import '@storybook/addon-knobs/register'
import '@storybook/addon-links/register'
import '@storybook/addon-notes/register'
import '@storybook/addon-storysource'
import '@storybook/addon-viewport/register'

import { addDecorator, addParameters } from '@storybook/angular'
import { withA11y } from '@storybook/addon-a11y'
import { withKnobs } from '@storybook/addon-knobs/angular'

addDecorator(withA11y)
addDecorator(withKnobs)

addParameters({
  a11y: {
    element: '#root',
  },
})
