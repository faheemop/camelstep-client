import React from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'react-grid-system';
import { useSelector } from 'react-redux';
/* eslint-disable import/no-unresolved */
import { SwiperSlide, Swiper } from 'swiper/react';

import { Text } from '../../Text/Text';
import coffee from '../../../assets/images/brewStepImage.png';
import { OtherProductsItem } from '../../OtherProducts/OtherProductsItem';
import { useMediaQuery } from '../../../hooks/useCurrentScreenWidth';
import { BrewStepButtons } from './BrewStepButtons';
import { API_ROOT } from '../../../config';

import './brewStep.scss';

export const BrewStep = ({
  brewStepData, nextStep, previousStep, currentStep, numberOfSteps,
}) => {
  const { t } = useTranslation('application');
  const moreThan576 = useMediaQuery('(min-width: 576px)');
  const moreThan1024 = useMediaQuery('(min-width: 1024px)');
  const waterValue = useSelector((state) => state.howToBrew.brewingMethodDetailedValues.waterAmount);
  const gramsValue = useSelector((state) => state.howToBrew.brewingMethodDetailedValues.grams);

  const replaceTagsWithValues = (text) => {
    const replacedText = text.replaceAll('%WATER%', waterValue).replaceAll('%GRAMMES%', gramsValue);
    return replacedText;
  };

  return (
    <Row style={{
      marginLeft: 0, marginRight: 0, maxWidth: '100%', height: '100%',
    }}
    >
      <Col xs={12} lg={6} className="container__col">
        <Text type="headline2" className="brew-step__title">
          {brewStepData.title || t('howToBrew.how')}
        </Text>
        <Text type="body1" style={{ margin: '3.2rem 0' }}>
          {replaceTagsWithValues(brewStepData.description_plain_text)}
        </Text>
        {brewStepData.products.length > 0 && (
          <>
            <Text type="body1" style={{ marginBottom: '2rem' }}>
              {t('howToBrew.readyTools').toUpperCase()}
              :
            </Text>
            <div className="other-stuff">
              <Swiper
                slidesPerView={moreThan576 ? 3 : 2}
                centeredSlides={!moreThan576}
                loop={!moreThan576}
              >
                {brewStepData.products.map((product, index) => (
                  <SwiperSlide key={index}>
                    <OtherProductsItem item={product} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </>
        )}
        {moreThan1024 && (
          <div className="control-buttons">
            <BrewStepButtons
              nextStep={nextStep}
              previousStep={previousStep}
              currentStep={currentStep}
              numberOfSteps={numberOfSteps}
            />
          </div>
        )}
      </Col>
      <Col xs={12} lg={6} className="container__col">
        <img className="brew-step__img" src={brewStepData.image_url === null ? coffee : `${API_ROOT}${brewStepData.image_url}`} alt="brew step" />
      </Col>
      {!moreThan1024 && (
        <Col xs={12} className="container__col">
          <div className="control-buttons">
            <BrewStepButtons
              nextStep={nextStep}
              previousStep={previousStep}
              currentStep={currentStep}
              numberOfSteps={numberOfSteps}
            />
          </div>
        </Col>
      )}
    </Row>
  );
};
