import React, { useState, useEffect } from 'react';
import { Collapse } from 'react-collapse';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { CustomCheckbox } from '../../../components/inputs/CustomCheckbox/CustomCheckbox';
import { setGiftMessage, toggleIfOrderIsAGift } from '../../../features/checkout/checkoutSlice';

import './sendAsPresent.scss';

export const SendAsPresentContainer = () => {
  const { t } = useTranslation('application', { keyPrefix: 'forms.present' });
  const dispatch = useDispatch();

  const isOrderAGift = useSelector((state) => state.checkout.isOrderAGift);
  const currentStep = useSelector((state) => state.checkout.currentStep);
  const giftMessage = useSelector((state) => state.checkout.giftMessage);
  const shipmentOption = useSelector((state) => state.checkout.shipmentOption);
  const [charactersLeft, setCharactersLeft] = useState(200);
  const [isOpened, setIsOpened] = useState(false);

  const characterWord = charactersLeft !== 1 ? t('characterPlural') : t('characterSingular');

  const handleIsAPresent = (e) => {
    const { target: { checked } } = e;
    dispatch(toggleIfOrderIsAGift(checked));
  };

  const handleNoteChange = (e) => {
    const { target: { value } } = e;
    setGiftMessage(value);
    if (value.length > 200) return;
    dispatch(setGiftMessage(value));
    setCharactersLeft(200 - value.length);
  };

  useEffect(() => {
    setIsOpened(isOrderAGift);
  }, [isOrderAGift]);

  if (currentStep > 1 && !isOrderAGift) return null;

  return (
    <div className="send-as-present">
      <CustomCheckbox
        label={t('sendAsPresent')}
        checked={isOrderAGift}
        onChange={handleIsAPresent}
        disabled={currentStep > 1 || shipmentOption === 'pickup'}
      />
      <Collapse isOpened={isOpened && currentStep === 1}>
        <textarea
          value={giftMessage}
          onChange={handleNoteChange}
          className="send-as-present__gift-note"
          placeholder={t('notePlaceholder')}
          rows={4}
          disabled={currentStep > 1 || shipmentOption === 'pickup'}
        />
        <span className="send-as-present__characters-left">{t('charactersLeft', { charactersLeft, character: characterWord })}</span>
      </Collapse>
    </div>
  );
};
