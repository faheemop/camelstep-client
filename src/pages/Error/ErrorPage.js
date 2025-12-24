import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/common/Button/Button';
import { SvgIcon } from '../../components/common/SvgIcon/SvgIcon';
import { Container } from '../../components/Layout/Container';
import Logo from '../../assets/icons/Logo.svg';
import { Text } from '../../components/Text/Text';

import './errorPage.scss';
import { localizedPath } from '../../helpers/localizedPath';

export const ErrorPage = ({
  message, title, subtitle, buttonText, buttonAction,
}) => {
  const { t } = useTranslation('application');
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <Container fluid>
        <div className="error-page__top">
          <Logo />
          <Button type="naked" onClick={() => navigate(localizedPath('/'))}>
            {t('common.goBackToHomepage')}
          </Button>
        </div>
        <div className="error-page__content">
          <div>
            <SvgIcon id="icon-error" width={128} height={128} />
            {title && (
              <Text className="error-page__title" type="headline2">
                {title}
              </Text>
            )}
            {subtitle && <Text className="error-pahe__subtitle" type="body2">{subtitle}</Text>}
            {message && (
              <div className="message-box">
                <Text type="body2">{message}</Text>
              </div>
            )}
            {buttonText && <Button type="primary" text={buttonText} onClick={buttonAction} />}
          </div>
        </div>
      </Container>
    </div>
  );
};
