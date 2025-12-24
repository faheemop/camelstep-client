import React from 'react';
import { toast } from 'react-toastify';
import { Text } from '../components/Text/Text';

/**
 * @param ev
 */
export function copyToClipboard(ev) {
  const { target } = ev;
  if (!target) return;
  console.log(target.dataset);
  const { copy, msg, type } = target.dataset;
  if (!copy || !msg) return;
  navigator.clipboard.writeText(copy);
  toast(<Text type="subtitle2">{msg}</Text>, {
    type,
  });
}
