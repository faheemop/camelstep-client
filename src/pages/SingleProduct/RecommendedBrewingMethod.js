import React from 'react';
import { Col, Row } from 'react-grid-system';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SquareBox } from '../../components/SqareBox/SquareBox';
import { Text } from '../../components/Text/Text';
import { localizedPath } from '../../helpers/localizedPath';
import { useMediaQuery } from '../../hooks/useCurrentScreenWidth';

export const RecommendedBrewingMethod = ({ brewSteps, brewMethod, productId, hasProductDetails }) => {
  const { t } = useTranslation('application');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const marginTop = isDesktop
    ? hasProductDetails
      ? '-270px'
      : '2rem'
    : '0px';
  return (
    <div>
      <Row>
        {/* <Col sm={12} md={6} lg={3.5} style={{ paddingBottom: '10vmin' }}> */}
        {/* <div>
            <Text type="headline2">{t('products.product.howToBrew')}</Text>
            <Text type="body2"> */}
        {/* TODO: to be switched when Barek gets the right copy from client */}
        {/* {t('products.product.howToBrewInfo')}
            </Text>
          </div>
        </Col> */}
        <Col sm={12} md={6} lg={3.5} style={{ display: 'flex', flexDirection: 'column', marginInlineStart: 'auto', marginTop }}>
          <div className="recommended-method">
            <div className="recommended-method__header">
              <Text type="body2">
                {t('products.product.recommendedMethod')}
                :
              </Text>
              <Text type="body2">{brewMethod?.name}</Text>
            </div>
            <hr style={{ margin: '2rem 0' }} />
            {/* <Text type="body2"> */}
            {/* TODO: to be switched when Barek gets the right copy from client */}
            {/* {t('products.product.howToBrewInfo')}
            </Text> */}
            <div className="recommended-method__steps">
              {brewSteps.map((brewStep, i) => (
                <div className="brew-step" key={i} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <SquareBox content={i + 1} style={{ marginRight: '1.5rem', minWidth: '2rem' }} />
                  <div>
                    <Text type="body1" className="brew-step__header" style={{ marginBottom: '0.5rem' }}>
                      {brewStep.short_title}
                    </Text>
                    <Text type="body1" className="brew-step__subheader">
                      {brewStep.short_description}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
            <Link to={localizedPath(`/how_to_brew/${productId}`)} className="recommended-method__link">
              <Text type="btn-s">{t('common.readMore')}</Text>
            </Link>
          </div>
        </Col>
      </Row>
    </div>
  );
};
