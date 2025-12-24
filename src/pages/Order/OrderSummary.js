import React, { useState } from 'react';
import { Row, Container, Col } from 'react-grid-system';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { Text } from '../../components/Text/Text';
import { Button } from '../../components/common/Button/Button';
import Logo from '../../assets/icons/Logo.svg';
import { SvgIcon } from '../../components/common/SvgIcon/SvgIcon';
import { OrderTotalPrice } from '../../components/Order/OrderTotalPrice';
import { mapOrderStatusToUiData } from '../../helpers/orderHelpers';
import { PaymentMethod } from '../Payment/PaymentMethod';
import { DownloadButton } from '../../components/common/Button/DownloadButton';
import { userApi } from '../../services/user';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { orderHasPreparedInvoice } from '../../components/Order/OrderStatuses';
import { OrderPackages } from './OrderPackages';
import { OrderAddresses } from './OrderAddresses';
import { CheckoutContext } from '../Checkout/checkoutContext';

import './orderSummary.scss';
import { RiyalSymbol } from '../../components/RiyalSymbol/RiyalSymbol';
import { localizedPath } from '../../helpers/localizedPath';

export const OrderSummary = ({ type, order }) => {
  const { t } = useTranslation('application');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const orderStatusData = mapOrderStatusToUiData(order.state);
  const hasOrderPaymentDetails = JSON.stringify(order.payment_source) !== '{}';

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // console.log("DISCOUNTTTT", order.discount_value)

  const orderSummaryHeading = (orderType) => {
    if (orderType === 'new') {
      return (
        <>
          <Text type="headline2" style={{ color: '#00546F', marginBottom: '1rem' }}>
            {t('order.created', { orderNumber: order.unique_number })}
          </Text>
          <Text type="body1" style={{ marginBottom: '3rem' }}>
            {t('order.notifyWhenShipped')}
          </Text>
        </>
      );
    }
    if (orderType === 'history') {
      return (
        <>
          <Text type="headline2" style={{ color: '#00546F', marginBottom: '1rem' }}>
            {t('order.orderNumber', { orderNumber: order.unique_number })}
          </Text>
          <Text type="body1" style={{ marginBottom: '3rem' }}>
            <span>{`${t('common.status')}: `}</span>
            {statusText && <span style={{ color: orderStatusData.color }}>
              {statusText}
            </span>}
          </Text>
        </>
      );
    }
    return null;
  };

  const handleDownloadInvoice = (e) => {
    if (!order.invoice_url) {
      setIsLoading(true);
      let downloadInvoiceTimeout;

      const refetchDataInterval = setInterval(() => {
        let result;

        if (type === 'new') {
          result = dispatch(userApi.endpoints.userOrderByPaymentId.initiate(order.payment_external_id, { forceRefetch: true }));
        } else if (type === 'history') {
          result = dispatch(userApi.endpoints.userOrderDetails.initiate(order.id, { forceRefetch: true }));
        }

        result.then((payload) => {
          if (payload.data.invoice_url) {
            const a = document.createElement('a');
            /* eslint-disable immutable/no-mutation */
            a.href = payload.data.invoice_url;
            a.setAttribute('download', '');
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setIsLoading(false);
            clearInterval(refetchDataInterval);
            clearTimeout(downloadInvoiceTimeout);
          }
        });
      }, 1000);

      downloadInvoiceTimeout = setTimeout(() => {
        clearInterval(refetchDataInterval);
        setIsLoading(false);
        setError(true);
      }, 10000);

      e.preventDefault();
    }
  };

  const getOrderStatus = (order) => {
    const { state, order_type } = order;

    const statusMap = {
      delivery: {
        processing: 'order.statuses.ordered',
        new: 'order.statuses.ordered',
        approved: 'order.statuses.ordered',
        ready: 'order.statuses.ready',
        shipped: 'order.statuses.completed',
      },
      pickup: {
        ready_to_pickup: 'order.statuses.ordered',
        customer_picked_up: 'order.statuses.ready',
        completed: 'order.statuses.completed',
      },
    };

    const key = statusMap[order_type]?.[state];
    return key ? t(key) : null;
  };

  const statusText = getOrderStatus(order);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <CheckoutContext.Provider>
      <div className="checkout-page order-summary">
        <Container fluid style={{ width: '100%' }}>
          <Row style={{ height: '100%' }}>
            <Col style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
              <div className="checkout__top">
                <Link to={localizedPath('/')}>
                  <Logo />
                </Link>
                {type === 'history' && (
                  <Button type="naked" onClick={() => navigate(-1)}>
                    {t('checkout.goBackToOrdersHistory')}
                  </Button>
                )}
                {type === 'new' && (
                  <Button type="naked" onClick={() => navigate(localizedPath('/'))}>
                    {t('checkout.goBackToHomepage')}
                  </Button>
                )}
              </div>
              <div className="order-summary__content">
                <SvgIcon id="icon-orders-cart-icon" width={50} height={50} />
                {orderSummaryHeading(type)}
                <Text style={{ marginBottom: '2rem' }} type="subtitle2">{t('order.summary')}</Text>
                {order.packages && <OrderPackages orderPackages={order.packages} />}
                {order.bundle_packages && <OrderPackages orderPackages={order.bundle_packages} />}
                <hr style={{ margin: '2rem 0', border: '1px solid #E2E0DB' }} />
                <Row>
                  <Col lg={6} md={6} />
                  <Col lg={6} md={6}>
                    <OrderTotalPrice
                      variant="secondary"
                      totalLabel={t('prices.subtotal')}
                      totalPrice={(
                        <span className="text__rtl">
                          {`${order.total_price}`}
                          {' '}
                          <RiyalSymbol size={10} />
                        </span>
                      )}
                    />
                    <OrderTotalPrice
                      variant="secondary"
                      totalLabel={t('prices.deliveryFee')}
                      totalPrice={(
                        <span className="text__rtl">
                          {`${order.shipment_price}`}
                          {' '}
                          <RiyalSymbol size={10} />
                        </span>
                      )}
                    />
                    {(!!parseFloat(order.discount_value)) && (
                      <OrderTotalPrice
                        variant="discount"
                        totalLabel={t('prices.discount')}
                        totalPrice={(
                          <span className="text__rtl">
                            {`${order.discount_value}`}
                            {' '}
                            <RiyalSymbol size={10} />
                          </span>
                        )}
                      />
                    )}
                    <OrderTotalPrice
                      variant="secondary"
                      totalLabel={t('prices.vat')}
                      totalPrice={(
                        <span className="text__rtl">
                          {`${order.vat_price}`}
                          {' '}
                          <RiyalSymbol size={10} />
                        </span>
                      )}
                    />
                    <OrderTotalPrice
                      variant="primary"
                      totalLabel={t('prices.total')}
                      totalPrice={(
                        <span className="text__rtl">
                          {`${order.summary_price} `}
                          {' '}
                          <RiyalSymbol size={10} />
                        </span>
                      )}
                    />
                    {orderHasPreparedInvoice(order) && (
                      <div style={{
                        display: 'flex', justifyContent: 'flex-end', alignItems: 'center', position: 'relative',
                      }}
                      >
                        {isLoading && <LoadingSpinner />}
                        <div>
                          <DownloadButton label={t('common.downloadInvoice')} fileUrl={order.invoice_url} withIcon clickHandler={handleDownloadInvoice} />
                          {error && <Text style={{ marginTop: '1rem' }} type="body2">{t('order.errors.unexpectedError')}</Text>}
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>
                <Row style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                  <Col>
                    {hasOrderPaymentDetails && (
                      <>
                        <Text type="body2" style={{ marginBottom: '2rem' }}>
                          {t('order.paymentDetails')}
                        </Text>
                        <div className="payment-details">
                          <PaymentMethod paymentSource={order?.payment_source} />
                          <Text type="body2" className="text__rtl">
                            {order.summary_price}
                            {' '}
                            <RiyalSymbol size={12} />
                          </Text>
                        </div>
                      </>
                    )}
                  </Col>
                </Row>
                <Row>
                  <OrderAddresses order={order} />
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </CheckoutContext.Provider>
  );
};
