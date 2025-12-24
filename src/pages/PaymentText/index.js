import React from 'react';
import { Col, Row, Container } from 'react-grid-system';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button/Button';
import { Text } from '../../components/Text/Text';

import './paymentText.scss';
import { MainLayout } from '../../components/Layout/MainLayout';
import { localizedPath } from '../../helpers/localizedPath';

export const PaymentTextPage = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="payment-page">
        <Container fluid style={{ width: '100%', height: '80vh' }}>
          <Row style={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Col
              style={{
                textAlign: 'center',
                flexDirection: 'column',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div className="payment-text-container">
                <Text className="payment-page__heading" type="headline2">
                  Payment is confirmed
                </Text>
                <Text className="payment-page__subheading" type="headline3">
                  Thanks for your order
                </Text>
                <Button
                  type="primary"
                  text="Go Back to Homepage"
                  onClick={() => navigate(localizedPath('/'))}
                />
              </div>

            </Col>
          </Row>
        </Container>
      </div>
    </MainLayout>
  );
};
