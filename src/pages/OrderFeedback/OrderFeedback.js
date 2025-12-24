import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-grid-system';

import { useGetOrderFeedbackQuery, useSendOrderFeedbackMutation } from '../../services/orderFeedback';
import { MainLayout } from '../../components/Layout/MainLayout';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { ThanksYou } from './ThanksYou';
import { NotFound } from './NotFound';
import { Header } from './components/Header';
import { OrderDetails } from './components/OrderDetails';
import { FeedbackForm } from './components/FeedbackForm';

import './OrderFeedback.scss';

export const OrderFeedback = () => {
  const { token } = useParams();

  const [orderId, setOrderId] = useState('');
  const [orderPorducts, setOrderProducts] = useState([]);
  const [isThankYouPageVisible, setIsThankYouPageVisible] = useState(false);

  const { data, error, isLoading } = useGetOrderFeedbackQuery(token);

  const [sendOrderFeedback] = useSendOrderFeedbackMutation();

  useEffect(() => {
    const { feedbackExists, order } = data || {};

    if (feedbackExists) {
      setIsThankYouPageVisible(true);

      return;
    }

    if (order) {
      setOrderId(order.id);
      setOrderProducts(order.products);
    }
  }, [data]);

  const onSendOrderFeedback = (feedback) => {
    sendOrderFeedback({
      token,
      feedback,
    });

    setIsThankYouPageVisible(true);
  };

  if (isThankYouPageVisible) {
    return (<ThanksYou />);
  }

  if (isLoading) {
    return (<LoadingSpinner />);
  }

  if (error) {
    return (<NotFound />);
  }

  return (
    <MainLayout className="order-feedback-page">
      <Container fluid>
        <Row align="center" justify="center" direction="row">
          <Col xs={6}>
            <Header orderId={orderId} />
            <OrderDetails orderId={orderId} orderPorducts={orderPorducts} />
            <FeedbackForm onSendOrderFeedback={onSendOrderFeedback} />
          </Col>
        </Row>
      </Container>
    </MainLayout>
  );
};
