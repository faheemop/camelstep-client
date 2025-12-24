import React, { useState, useEffect } from 'react';
import { eventBus } from '../../helpers/eventBus';
import { Text } from '../Text/Text';
import CloseIcon from '../../assets/icons/x.svg';

import './overlay.scss';

export const Overlay = () => {
  const [open, setOpen] = useState(false);
  const [overlayContent, setOverlayContent] = useState(null);

  const handleOverlayClose = () => {
    setOpen(false);
    setTimeout(() => {
      setOverlayContent(null);
    }, 350);
  };

  useEffect(() => {
    const overlayOpener = eventBus.subscribe('overlay:open', (data) => {
      if (!data) return;
      const { title, body } = data;
      setOpen(true);
      setOverlayContent({ title, content: body });
    });

    const remoteClose = eventBus.subscribe('overlay:close', handleOverlayClose);

    return () => {
      overlayOpener.remove();
      remoteClose.remove();
    };
  }, []);

  return (
    <div className={`overlay-wrapper ${open ? 'is-open' : ''}`}>
      <div className="overlay-content">
        <div className="overlay-header">
          {overlayContent?.title && (
            <Text type="headline2">{overlayContent.title}</Text>
          )}
          <CloseIcon
            onClick={handleOverlayClose}
          />
        </div>
        <div className="overlay-content-body">{overlayContent?.content}</div>
      </div>
    </div>
  );
};
