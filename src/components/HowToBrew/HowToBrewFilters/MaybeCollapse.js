import React from 'react';
import { Collapse } from 'react-collapse';

export const MaybeCollapse = ({ disableCollapse, isOpened, children }) => (disableCollapse ? (
  <div className="ReactCollapse--collapse" style={{ height: 'auto' }}>
    <div className="ReactCollapse--content">{children}</div>
  </div>
) : (
  <Collapse isOpened={isOpened}>{children}</Collapse>
));
