import React from 'react';
import { TestComponent } from './test';

// eslint-disable-next-line import/no-default-export
export default {
  title: 'Components/Test',
  component: TestComponent,
  parameters: {
    name: 'World',
  },
};

export const Test = () => <TestComponent name="World" />;
