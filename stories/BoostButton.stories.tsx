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
      },
    },
    value: {
        control: {
          type: 'number',
        },
      },
  }, 
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<BoostButtonProps> = args => <BoostButton content="test" value={124_000} {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
