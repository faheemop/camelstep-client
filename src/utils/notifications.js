import React from 'react';

import { toast } from 'react-toastify';
import { Text } from '../components/Text/Text';

export const notify = (message, type) => {
  toast(<Text type="subtitle2">{message}</Text>, {
    type,
  });
};
