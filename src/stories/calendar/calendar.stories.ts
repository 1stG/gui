import { storiesOf } from '@storybook/angular'

import { CalendarModule } from '../../calendar/public-api'

storiesOf('calendar', module).add('default', () => ({
  moduleMetadata: {
    imports: [CalendarModule],
  },
  template: `<g-calendar></g-calendar>`,
}))
