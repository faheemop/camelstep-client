import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col } from 'react-grid-system';

import { Button } from '../../components/common/Button/Button';
import { Text } from '../../components/Text/Text';
import { MainLayout } from '../../components/Layout/MainLayout';
import { localizedPath } from '../../helpers/localizedPath';

export const ThanksYou = () => {
  const navigate = useNavigate();

  const [t] = useTranslation('application');

  return (
    <MainLayout className="order-feedback-page">
      <Container fluid>
        <Row align="center" justify="center" direction="row">
          <Col xs={6}>
            <Text
              className="order-feedback-page__greeting"
              type="body1"
            >
              {t('orderFeedback.thanksYou.headline')}
            </Text>
            <Text type="body1">{t('orderFeedback.thanksYou.body')}</Text>
            <Button
              onClick={() => navigate(localizedPath('/'))}
              text={t('orderFeedback.thanksYou.button')}
              type="primary"
              className="order-feedback-page__form-button"
            />
          </Col>
        </Row>
      </Container>
    </MainLayout>
  );
};
