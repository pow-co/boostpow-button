import React from 'react';
import { Meta, Story } from '@storybook/react';
import BoostButton, { BoostButtonProps } from '../src/BoostButton';

const meta: Meta = {
  title: 'Boost Button',
  component: BoostButton,
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

const Template: Story<BoostButtonProps> = args => <BoostButton theme="dark" showDifficulty difficulty={100} content="114dba7cfe93023c166e6cad44f2ddf5aa7619828d81b4fa64e3fce3aec9eb04" value={124_000} {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
