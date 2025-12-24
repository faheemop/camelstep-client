import React from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Container, Row } from 'react-grid-system';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MainLayout } from '../../components/Layout/MainLayout';
import { Text } from '../../components/Text/Text';
import { ProfileNavButtons } from './ProfileNavButtons';

import './profilePage.scss';

export const ProfilePage = () => {
  const { t } = useTranslation('application');
  return (
    <MainLayout className="profile-page">
      <Helmet>
        <title>{t('seo.profile.title')}</title>
        <meta name="description" content={t('seo.profile.description')} />
      </Helmet>
      <Container fluid className="profile-page-container">
        <Row className="profile-page-content">
          <Col lg={3} className="firstCol">
            <div className="firstCol-content">
              <Text type="headline2" className="profile-page-text">
                {t('profile.greeting')}
              </Text>
              <ProfileNavButtons />
            </div>
          </Col>
          <Col className="secondCol" lg={8}>
            <Col>
              <Outlet />
            </Col>
          </Col>
        </Row>
      </Container>
    </MainLayout>
  );
};
