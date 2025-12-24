import React from 'react';

/**
 * TestComponent - to be removed
 *
 * @param {!string} name Name to display
 * @returns {HTMLElement} Returns h1 with name
 */

export const TestComponent = ({ name }) => (
  <h1>{`Hello ${name}!`}</h1>
);
