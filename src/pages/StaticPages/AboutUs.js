import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { MainLayout } from '../../components/Layout/MainLayout';
import { Text } from '../../components/Text/Text';

import './staticPage.scss';

export const AboutUs = () => {
  const { t } = useTranslation('application');
  return (
    <MainLayout className="static_page about_us">
      <Helmet>
        <title>{t('seo.aboutUs.title')}</title>
        <meta name="description" content={t('seo.aboutUs.description')} />
      </Helmet>
      <Text type="headline2">{t('aboutUs.title')}</Text>
      <Text type="body1">{t('aboutUs.p1')}</Text>
      <Text type="body1">{t('aboutUs.p2')}</Text>
      <Text type="headline3">{t('aboutUs.sub1')}</Text>
      <Text type="body1">{t('aboutUs.p3')}</Text>
      <Text type="headline3">{t('aboutUs.sub2')}</Text>
      <Text type="body1">{t('aboutUs.p4')}</Text>
      <Text type="headline3">{t('aboutUs.sub3')}</Text>
      <Text type="body1">{t('aboutUs.p5')}</Text>
      <Text type="headline3">{t('aboutUs.sub4')}</Text>
      <Text type="body1">{t('aboutUs.p6')}</Text>
    </MainLayout>
  );
};
