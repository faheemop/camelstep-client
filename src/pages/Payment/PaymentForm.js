import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Text } from '../../components/Text/Text';
import { convertToFinalPaymentValue } from '../../helpers/productHelpers';

import './paymentForm.scss';

export const PaymentForm = () => {
  const { t, i18n } = useTranslation('application');
  const currentLanguage = i18n.language;

  const { PUBLIC_URL, MOYASAR_API_KEY } = process.env;
  const paymentDescription = (paymentId) => `Payment ${paymentId}`;
  const paymentData = useSelector((state) => state.checkout.paymentData);

  useEffect(() => {
    if (!paymentData) return;
    // eslint-disable-next-line no-undef
    Moyasar.init({
      element: '.mysr-form',
      amount: convertToFinalPaymentValue(paymentData.amount),
      currency: 'SAR',
      description: paymentDescription(paymentData?.metadata?.fingerprint),
      publishable_api_key: MOYASAR_API_KEY,
      callback_url: `${PUBLIC_URL}/${currentLanguage}/payment/validate`,
      methods: ['applepay', 'creditcard', 'stcpay'],
      apple_pay: {
        country: 'SA',
        label: 'CamelStep',
        validate_merchant_url: 'https://api.moyasar.com/v1/applepay/initiate',
      },
      metadata: {
        fingerprint: paymentData?.metadata?.fingerprint,
        orderNumber: paymentData?.metadata?.order_number,
      },
      language: i18n.language,
    });
  }, [paymentData]);

  return (
    <div className="payment-wrapper">
      <Text type="headline2" style={{ marginBlockEnd: 20 }}>
        {t('payments.title')}
      </Text>
      <div className="mysr-form" />
    </div>
  );
};
