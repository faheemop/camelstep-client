import React, { useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { Text } from '../../Text/Text';

import './MessageBox.scss';

export const MessageBox = ({
  label, maxLength, value, onChange,
}) => {
  const [t] = useTranslation('application');

  const [isFocused, setIsFocused] = useState(false);

  const charactersLeft = maxLength - value.length;

  const toggleFocused = () => setIsFocused((state) => !state);

  return (
    <div className="message-box">
      <label
        htmlFor={label}
        className={classNames({
          'message-box__text-area-container': true,
          'message-box__text-area-container--focused': isFocused,
        })}
      >
        <textarea
          id={label}
          value={value}
          onChange={onChange}
          placeholder={label}
          onFocus={toggleFocused}
          onBlur={toggleFocused}
          maxLength={maxLength}
          className={classNames({
            'message-box__text-area': true,
            'message-box__text-area--focused': isFocused,
          })}
        />
        <span className="message-box__label">{label}</span>
      </label>
      <Text
        type="caption"
        className={classNames({
          'message-box__characters-counter': true,
          'message-box__characters-counter--focused': isFocused,
          'message-box__characters-counter--full': charactersLeft === 0,
        })}
      >
        {charactersLeft}
        {' '}
        {t('orderFeedback.charactersLeft')}
      </Text>
    </div>
  );
};
