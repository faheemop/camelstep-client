import React from 'react';

/* eslint-disable import/no-unresolved */
import { components } from 'react-select';

const { Placeholder, ValueContainer } = components;

/* eslint-disable react/jsx-props-no-spreading */
export const CustomValueContainer = ({ children, ...props }) => (
  <ValueContainer {...props}>
    <Placeholder {...props} isFocused={props.isFocused}>
      {props.selectProps.placeholder}
    </Placeholder>
    {React.Children.map(children, (child) => (child && child.type !== Placeholder ? child : null))}
  </ValueContainer>
);
