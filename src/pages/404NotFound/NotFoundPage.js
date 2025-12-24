import React from 'react';
import { Col, Row, Container } from 'react-grid-system';
import { useTranslation } from 'react-i18next';

import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button/Button';
import { Text } from '../../components/Text/Text';
import Logo from '../../assets/icons/Logo.svg';
import NotFoundImage from '../../assets/icons/404.svg';
import { localizedPath } from '../../helpers/localizedPath';

import './notFoundPage.scss';

export const NotFoundPage = () => {
  const { t } = useTranslation('application');
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <Container fluid style={{ width: '100%' }}>
        <Row style={{ height: '100%' }}>
          <Col style={{
            paddingTop: '2rem', paddingBottom: '4rem', flexDirection: 'column', display: 'flex',
          }}
          >
            <div className="checkout__top">
              <Logo />
              <Button type="naked" onClick={() => navigate(localizedPath('/'))}>
                {t('notFound.goBackToHomepage')}
              </Button>
            </div>
            <div className="not-found-page__content">
              <div>
                <NotFoundImage className="not-found-page__image" />
                <Text className="not-found-page__heading" type="headline3">
                  {t('notFound.heading')}
                </Text>
                <Text className="not-found-page__subheading" type="body2">
                  {t('notFound.subheading')}
                </Text>
                <Button className="not-found-page__button" type="primary" text={t('notFound.goBackToHomepage')} onClick={() => navigate(localizedPath('/'))} />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
