import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  useGetNotificationSettingsQuery,
  useSetNotificationSettingsMutation,
} from '../../services/user';
import { CustomCheckbox } from '../inputs/CustomCheckbox/CustomCheckbox';
import { Text } from '../Text/Text';

import './notificationsTable.scss';

export const NotificationsTable = () => {
  const { t } = useTranslation('application');
  useGetNotificationSettingsQuery();

  const notificationSettings = useSelector((state) => state.user.notifications);

  const [setNotificationSettings] = useSetNotificationSettingsMutation();

  const handleNotificationSettingChange = async (e) => {
    const { checked, name } = e.target;
    const newNotificationSettings = { ...notificationSettings, [name]: checked };
    await setNotificationSettings(newNotificationSettings);
  };

  return (
    <table className="notifications-table">
      <thead>
        <tr>
          <th scope="col">
            <Text type="overline">{t('profile.notifications.tableHeading')}</Text>
          </th>
          <th scope="col">
            <Text type="overline">{t('forms.email.label')}</Text>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <Text type="subtitle2">{t('profile.notifications.products')}</Text>
          </td>
          <td data-label="E-MAIL">
            <CustomCheckbox
              name="wishlist_email"
              checked={notificationSettings.wishlist_email}
              value={notificationSettings.wishlist_whatsapp}
              onChange={handleNotificationSettingChange}
            />
          </td>
        </tr>
        <tr>
          <td>
            <Text type="subtitle2">{t('profile.notifications.discounts')}</Text>
          </td>
          <td data-label="E-MAIL">
            <CustomCheckbox
              name="discounts_and_promotions_email"
              checked={notificationSettings.discounts_and_promotions_email}
              value={notificationSettings.discounts_and_promotions_email}
              onChange={handleNotificationSettingChange}
            />
          </td>
        </tr>
        <tr>
          <td>
            <Text type="subtitle2">
              {t('profile.notifications.orders')}
              {' '}
            </Text>
          </td>
          <td data-label="E-MAIL">
            <CustomCheckbox
              name="order_updates_email"
              checked={notificationSettings.order_updates_email}
              value={notificationSettings.order_updates_email}
              onChange={handleNotificationSettingChange}
              disabled
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};
