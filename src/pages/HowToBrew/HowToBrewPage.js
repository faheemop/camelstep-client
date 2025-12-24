import React from 'react';
import { Row } from 'react-grid-system';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { HowToBrewFilters } from '../../components/HowToBrew/HowToBrewFilters/HowToBrewFilters';
import { HowToBrewStepper } from '../../components/HowToBrew/HowToBrewStepper/HowToBrewStepper';
import { MainLayout } from '../../components/Layout/MainLayout';

import './howToBrewPage.scss';

export const HowToBrewPage = () => {
  const { t } = useTranslation('application');

  return (
    <MainLayout fluid className="how-to-brew-page">
      <Helmet>
        <title>{t('seo.howToBrew.title')}</title>
        <meta name="description" content={t('seo.howToBrew.description')} />
      </Helmet>
      <Row style={{ marginLeft: 0, marginRight: 0, paddingBottom: '5%' }}>
        <HowToBrewFilters />
      </Row>
      <HowToBrewStepper />
    </MainLayout>
  );
};
