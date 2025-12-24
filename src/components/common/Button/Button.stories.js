import React from 'react';

import { Button } from './Button';
import Coffee from '../../../assets/icons/coffee-icon.svg';

export default {
  title: 'Components/common/Button',
  component: Button,
};

const SvgIcon = () => <img style={{ height: '50px' }} src={Coffee} alt="icon" />;

const Template = (args) => <Button {...args} />;
const TemplateIcon = (args) => (
  <Button {...args}>
    <SvgIcon />
  </Button>
);

export const Primary = Template.bind({});
Primary.args = {
  text: 'Next',
  type: 'primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  text: 'See how to brew',
  type: 'secondary',
};

export const SecondaryIcon = TemplateIcon.bind({});
SecondaryIcon.args = {
  text: 'See how to brew',
  type: 'secondary',
};

export const Tertiary = Template.bind({});
Tertiary.args = {
  text: 'TasteWheel',
  type: 'tertiary',
};
