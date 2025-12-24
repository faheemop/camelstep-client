import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '../../../components/Text/Text';
import { OrderHistoryList } from '../../../components/OrderHistory/OrderHistoryList';
import { useUserOrdersQuery } from '../../../services/user';

export const OrdersHistory = () => {
  const { t } = useTranslation('application');
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [localOrders, setLocalOrders] = useState([]);

  const { data: orders = {}, isLoading } = useUserOrdersQuery({ page: currentPage, perPage: 10 });

  const allowedStatuses = [
    'payment_succeed',
    'customer_picked_up',
    'in_delivery',
    'ready_to_pickup',
    'approved',
  ];

  useEffect(() => {
    if (!orders?.records) return;
    const filteredOrders = orders?.records;
    setLocalOrders((prevState) => ([...prevState, ...filteredOrders]));
    setMaxPage(orders.total_pages);
  }, [orders]);

  useEffect(() => {
    if (!localOrders && !isLoading) return;
    // eslint-disable-next-line no-unused-vars
    const callback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio !== 1 || isLoading) return;
        setCurrentPage((prevState) => (
          prevState !== maxPage ? prevState + 1 : prevState
        ));
      });
    };

    const options = {
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(callback, options);
    const target = document.querySelector('.scroll-trigger');
    if (!target) return;
    observer.observe(target);

    // eslint-disable-next-line consistent-return
    return () => observer.disconnect();
  }, [localOrders]);

  return (
    <div>
      <Text className="profile-subpage__title" type="headline3">{t('profile.nav.orders')}</Text>
      {orders.records && <OrderHistoryList orders={localOrders} />}
      <div className="scroll-trigger" />
    </div>
  );
};
