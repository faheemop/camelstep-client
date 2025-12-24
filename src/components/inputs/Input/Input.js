import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Text } from '../../Text/Text';

import './Input.scss';

/* eslint-disable react/jsx-props-no-spreading */
export const Input = ({
  name, id, type = 'text', label, value, error, onChange, icon, customWrapperClass = '', fileRef, ...rest
}) => {
  const { i18n, t } = useTranslation('application');
  const charactersLeft = Number(rest?.maxLength) - (Number(value?.length) || Number(rest?.defaultValue?.length));
  return (
    <div className={`custom-input-wrapper ${customWrapperClass}`}>
      {icon && <span className="custom-input__icon">{icon}</span>}
      <label className={`custom-input ${icon && 'icon'}`} htmlFor={id || name}>
        <input
          id={id || name}
          name={name}
          value={value}
          className={`custom-input__input ${error && 'error'}`}
          type={type}
          placeholder={' '}
          onChange={onChange}
          dir={i18n.language === 'en' ? 'ltr' : 'rtl'}
          {...rest}
        />
        {label && <span className="custom-input__label-container"><span className="custom-input__label">{label}</span></span>}
        {type === 'file' && (value || fileRef) && (
          <Text type="caption">{fileRef?.name || value?.split('\\').pop()}</Text>
        )}
      </label>
      {rest?.maxLength > 0 && Number.isInteger(charactersLeft) && (
        <Text
          type="caption"
          className={classNames({
            'message-box__characters-counter': true,
            'message-box__characters-counter--focused': false,
            'message-box__characters-counter--full': charactersLeft === 0,
          })}
        >
          {charactersLeft}
          {' '}
          {t('orderFeedback.charactersLeft')}
        </Text>
      )}
      {error && <span className="custom-input__error-msg">{error}</span>}
    </div>
  );
};
