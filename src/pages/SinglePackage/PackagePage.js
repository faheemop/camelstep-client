import React, { useEffect } from 'react';
import { Container } from 'react-grid-system';
import { useParams } from 'react-router-dom';
import i18next from 'i18next';

import { MainLayout } from '../../components/Layout/MainLayout';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { NotFoundPage } from '../404NotFound/NotFoundPage';
import { useGetSinglePackageQuery } from '../../services/products';
import { SinglePackage } from './SinglePackage';

import '../SingleProduct/SingleProduct.scss';

export const PackagePage = () => {
  const { packageId } = useParams();
  const {
    data, error, isFetching, refetch,
  } = useGetSinglePackageQuery(packageId);

  useEffect(() => {
    i18next.on('languageChanged', refetch);
    return () => {
      i18next.off('languageChanged', refetch);
    };
  }, []);

  if (isFetching) {
    return (
      <MainLayout>
        <Container className="single-product-container">
          <LoadingSpinner />
        </Container>
      </MainLayout>
    );
  }

  if (error) {
    return <NotFoundPage />;
  }

  return <SinglePackage packageData={data} packageId={packageId} />;
};
