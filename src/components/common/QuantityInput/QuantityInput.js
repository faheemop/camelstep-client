import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import './quantityInput.scss';
import { notify } from '../../../utils/notifications';

export const QuantityInput = ({
  small, style, initialValue, onQuantityChange, maxQuantity, maxTotal, disabled,
}) => {
  const [value, setValue] = useState(initialValue);
  const { t } = useTranslation('application');

  const increment = () => {
    if (disabled) return;
    if (value === maxQuantity) {
      notify(t('notifications.cart.limit'), 'warning');
      return;
    }
    setValue((prevValue) => prevValue + 1);
  };

  const decrement = () => {
    if (disabled) return;
    if (value === 1) return;
    setValue((prevValue) => prevValue - 1);
  };

  useEffect(() => {
    onQuantityChange(value);
  }, [value]);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className={`quantity ${small && 'small'}`} style={style || null}>
      <button type="button" className="quantity__button quantity__button--left" onClick={() => decrement()} aria-label="decrement">
        <span className="minus-mark" />
      </button>
      <input
        className="quantity__input"
        type="number"
        value={value}
        min="1"
        max="100"
        readOnly
        style={{
          width: `${value?.toString().length ? `${value.toString().length}ch` : '2ch'}`,
        }}
        disabled={disabled}
        lang="en"
      />
      <button disabled={maxTotal === maxQuantity} type="button" className="quantity__button quantity__button--right" onClick={() => increment()} aria-label="increment">
        <span className="plus-mark" />
      </button>
    </div>
  );
};
