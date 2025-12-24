import React from 'react';
import { useTranslation } from 'react-i18next';

import { SvgIcon } from '../../common/SvgIcon/SvgIcon';
import { Input } from './Input';
import { LoadingSpinner } from '../../LoadingSpinner/LoadingSpinner';

import './giftCodeInput.scss';

export const GiftCodeInput = ({
  onGiftCodeChange, isLoading, error, success, value,
}) => {
  const { t } = useTranslation('application', { keyPrefix: 'forms' });

  const handleGiftCodeChange = (e) => {
    const { target: { value: inputValue } } = e;
    onGiftCodeChange(inputValue);
  };

  return (
    <div className="gift-code-input">
      <Input
        label={t('giftCode.label')}
        icon={<SvgIcon id="icon-gift-code" />}
        onChange={handleGiftCodeChange}
        value={value}
      />
      {isLoading && <LoadingSpinner />}
      {error && !success && <span className="custom-input__error-msg">{error.join(', ')}</span>}
      {success && <span className="custom-input__success-msg">{t('giftCode.successMsg')}</span>}
    </div>
  );
};
