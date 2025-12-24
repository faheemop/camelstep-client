import React from 'react';
import { Col, Row, Container } from 'react-grid-system';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button } from '../../components/common/Button/Button';
import { Text } from '../../components/Text/Text';
import Logo from '../../assets/icons/Logo.svg';
import { ProductsList } from '../../components/ProductsList/ProductsList';

import './temporarilyUnavailable.scss';
import { Footer } from '../../components/Footer/Footer';
import { localizedPath } from '../../helpers/localizedPath';

export const TemporaryUnavailablePage = () => {
  const { t } = useTranslation('application');
  const navigate = useNavigate();

  return (
    <div className="inactive-product-page">
      <Container fluid style={{ width: '100%' }}>
        <Row style={{ height: '100%' }}>
          <Col style={{
            paddingTop: '2rem', paddingBottom: '4rem', flexDirection: 'column', display: 'flex',
          }}
          >
            <div className="checkout__top">
              <Logo />
              <Button type="naked" onClick={() => navigate(localizedPath('/'))}>
                {t('inactiveProduct.goBackToHomepage')}
              </Button>
            </div>
            <div className="inactive-product-page__content" style={{ width: '100%' }}>
              <div style={{ width: '100%' }}>
                <Text className="inactive-product-page__heading" type="headline2">
                  {t('inactiveProduct.heading')}
                </Text>
                <Text className="inactive-product-page__subheading" type="body2">
                  {t('inactiveProduct.subheading')}
                </Text>
                <ProductsList />
                <Button className="inactive-product-page__button" type="primary" text={t('inactiveProduct.goBackToHomepage')} onClick={() => navigate('/')} />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};
