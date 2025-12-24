import React from 'react';
import { useTranslation } from 'react-i18next';
import { eventBus } from '../../helpers/eventBus';
import { Button } from '../common/Button/Button';
import { Text } from '../Text/Text';

import './deleteAddressModal.scss';

export const DeleteAddressModal = ({ deleteAction }) => {
  const { t } = useTranslation('application');

  const closeModal = () => eventBus.publish('modal:close');

  const handleDelete = () => {
    closeModal();

    deleteAction();
  };

  return (
    <>
      <Text style={{ marginBottom: '2rem', color: '#00546F' }} type="headline3">
        {t('modals.address.heading')}
      </Text>
      <Text style={{ marginBottom: '3rem' }} type="body2">
        {t('modals.address.text')}
      </Text>
      <div className="modal-actions">
        <Button type="primary" inverted text={t('forms.cancel')} onClick={closeModal} />
        <Button type="primary" text={t('forms.delete')} onClick={handleDelete} />
      </div>
    </>
  );
};
