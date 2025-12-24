import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '../../../components/Text/Text';
import { NotificationsTable } from '../../../components/Notifications/NotificationsTable';

export const Notifications = () => {
  const { t } = useTranslation('application');

  return (
    <div>
      <Text type="headline3" style={{ marginBottom: '2rem' }}>{t('profile.nav.notifications')}</Text>
      <Text type="body2">{t('profile.notifications.info')}</Text>
      <NotificationsTable />
    </div>
  );
};
