import React from 'react';
import { Meta, Story } from '@storybook/react';
import { useEffect } from '@storybook/addons';
import BoostButton, { BoostButtonProps } from '../src/BoostButton';

const meta: Meta = {
  title: 'Boost Button',
  component: BoostButton,
  decorators: [
    (Story) => {
      useEffect(() => {
        const script = document.createElement('script')
        script.src = "https://one.relayx.io/relayone.js"
        document.body.appendChild(script);
      },[])
      return <Story/>
    }
  ],
  argTypes: {
    content: {
      control: {
        type: 'text',
        default: "114dba7cfe93023c166e6cad44f2ddf5aa7619828d81b4fa64e3fce3aec9eb04"
      },
    },
    value: {
        control: {
          type: 'number',
          default: 124_000
        },
      },
  }, 
  parameters: {
    controls: { expanded: true },
  },
};



export default meta;

const Template: Story<BoostButtonProps> = args => 
<BoostButton theme="light" wallet='relayx' content='114dba7cfe93023c166e6cad44f2ddf5aa7619828d81b4fa64e3fce3aec9eb04' showDifficulty difficulty={100}  value={124_000} {...args} />
;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
