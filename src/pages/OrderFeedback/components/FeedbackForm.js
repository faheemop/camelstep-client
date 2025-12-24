import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert } from '../../../components/common/Alert/Alert';
import { Button } from '../../../components/common/Button/Button';
import { RateBoxes } from './RateBoxes';
import { FeedbackNote } from './FeedbackNote';
import { scores } from '../data/scores';

const scoresBadOrNeutral = [scores.BAD, scores.NEUTRAL].flat();

export const FeedbackForm = ({ onSendOrderFeedback }) => {
  const [t] = useTranslation('application');

  const [isNoteSectionVisible, setIsNoteSectionVisible] = useState(false);
  const [orderScore, setOrderScore] = useState();
  const [deliveryScore, setDeliveryScore] = useState();
  const [feedbackNoteContent, setFeedbackNoteContent] = useState('');
  const [isValidationMessageVisible, setIsValidationMessageVisible] = useState(false);

  const isAnyScoreBadOrNeutral = () => scoresBadOrNeutral.includes(orderScore) || scoresBadOrNeutral.includes(deliveryScore);

  const onSubmitOrderFeedbackForm = () => {
    if (!orderScore || !deliveryScore) {
      setIsValidationMessageVisible(true);

      return;
    }

    onSendOrderFeedback({
      orderScore: orderScore.toLowerCase(),
      deliveryScore: deliveryScore.toLowerCase(),
      feedbackNote: feedbackNoteContent,
    });
  };

  useEffect(() => {
    if (isAnyScoreBadOrNeutral()) {
      setIsNoteSectionVisible(true);
    } else {
      setIsNoteSectionVisible(false);
    }
  }, [orderScore, deliveryScore]);

  const onFeedbackNoteContentChange = ({ target: { value } }) => setFeedbackNoteContent(value);

  return (
    <form className="order-feedback-page__form">
      <RateBoxes
        orderScore={orderScore}
        deliveryScore={deliveryScore}
        scores={scores}
        onOrderScoreChange={(score) => setOrderScore(score)}
        onDeliveryScoreChange={(score) => setDeliveryScore(score)}
      />
      <FeedbackNote
        feedbackNoteContent={feedbackNoteContent}
        onFeedbackNoteContentChange={onFeedbackNoteContentChange}
        isNoteSectionVisible={isNoteSectionVisible}
      />
      {isValidationMessageVisible && <Alert type="danger" className="order-feedback-page__form-validation-messages">{t('orderFeedback.validationMessage')}</Alert>}
      <Button
        onClick={onSubmitOrderFeedbackForm}
        text={t('orderFeedback.send')}
        type="primary"
        className="order-feedback-page__form-button"
      />
    </form>
  );
};
