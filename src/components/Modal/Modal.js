import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { eventBus } from '../../helpers/eventBus';
import { Text } from '../Text/Text';
import CloseIcon from '../../assets/icons/x.svg';
import { Button } from '../common/Button/Button';

import './Modal.scss';

export const Modal = () => {
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isAlertType, setIsAlertType] = useState(false);
  const [cannotClose, setCannotClose] = useState(false);
  const [isFixedWidth, setIsFixedWidth] = useState(false);
  const [hideOnPathChange, setHideOnPathChange] = useState(false);
  const { pathname } = useLocation();

  const handleModalClose = () => {
    setOpen(false);
    setTimeout(() => {
      setIsAlertType(false);
      setCannotClose(false);
      setIsFixedWidth(false);
      setModalContent(null);
      setHideOnPathChange(false);
      eventBus.publish('modal:ready');
    }, 350);
  };

  if (open && hideOnPathChange && !pathname.includes('/checkout')) {
    handleModalClose();
    return null;
  }

  useEffect(() => {
    const modalOpener = eventBus.subscribe('modal:open', (data) => {
      if (!data) return;
      const {
        alertType, title, body, noClose, fixedWidth, clearOnPathChange,
      } = data;
      if (alertType) setIsAlertType(true);
      if (noClose) setCannotClose(true);
      if (fixedWidth) setIsFixedWidth(true);
      if (clearOnPathChange) setHideOnPathChange(true);

      setOpen(true);
      setModalContent({ title, content: body });
    });

    const remoteClose = eventBus.subscribe('modal:close', handleModalClose);

    return () => {
      modalOpener.remove();
      remoteClose.remove();
    };
  }, []);

  return modalContent ? (
    <div
      className={`modal-wrapper ${open ? 'is-open' : ''} ${isAlertType && 'alert'} ${
        isFixedWidth ? ' fixed-width' : ''
      }`}
    >
      <div className="modal-content">
        <div className="modal-header">
          {modalContent?.title && (
            <Text type="headline2" className="modal-title">
              {modalContent.title}
            </Text>
          )}
          {!cannotClose && <Button className="modal-close" onClick={handleModalClose} icon={<CloseIcon />} />}
        </div>
        <div className="modal-body">{modalContent?.content}</div>
      </div>
    </div>
  ) : null;
};
