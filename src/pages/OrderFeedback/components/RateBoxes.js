import React from 'react';
import { useTranslation } from 'react-i18next';

import { Text } from '../../../components/Text/Text';
import FaceGood from '../../../assets/icons/face-good.svg';
import FaceNeutral from '../../../assets/icons/face-neutral.svg';
import FaceBad from '../../../assets/icons/face-bad.svg';
import { RateBox } from '../../../components/RateBox/RateBox';
import { scores } from '../data/scores';

const ratesBoxesData = [
  {
    value: scores.GOOD[0],
    icon: <FaceGood />,
  },
  {
    value: scores.NEUTRAL[0],
    icon: <FaceNeutral />,
  },
  {
    value: scores.BAD[0],
    icon: <FaceBad />,
  },
];

export const RateBoxes = ({
  orderScore, deliveryScore, onOrderScoreChange, onDeliveryScoreChange,
}) => {
  const [t] = useTranslation('application');

  return (
    <div>
      <Text type="subtitle2">{t('orderFeedback.order')}</Text>
      <div className="order-feedback-page__rate-boxes">
        {ratesBoxesData.map(((data) => (
          <RateBox
            groupId="order-score"
            value={data.value}
            text={t(`orderFeedback.score${data.value}`)}
            icon={data.icon}
            selected={(text) => text === orderScore}
            onSelect={onOrderScoreChange}
            key={`order-score-${data.value}`}
          />
        )))}
      </div>
      <Text type="subtitle2">{t('orderFeedback.delivery')}</Text>
      <div className="order-feedback-page__rate-boxes">
        {ratesBoxesData.map(((data) => (
          <RateBox
            groupId="delivery-score"
            value={data.value}
            text={t(`orderFeedback.score${data.value}`)}
            icon={data.icon}
            selected={(text) => text === deliveryScore}
            onSelect={onDeliveryScoreChange}
            key={`delivery-score-${data.value}`}
          />
        )))}
      </div>
    </div>
  );
};
