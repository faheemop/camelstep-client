import React, { useEffect } from 'react';
import { Container } from 'react-grid-system';
import { useParams, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { MainLayout } from '../../components/Layout/MainLayout';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { NotFoundPage } from '../404NotFound/NotFoundPage';
import { useGetSingleProductQuery } from '../../services/products';
import { SingleProduct } from './SingleProduct';

import './SingleProduct.scss';
import { TemporaryUnavailablePage } from '../TemporarilyUnavailable';
import { localizedPath } from '../../helpers/localizedPath';

export const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation('application');

  const {
    data,
    error,
    isFetching,
  } = useGetSingleProductQuery({ slug, lang: i18n.language });

  useEffect(() => {
    if (error?.status === 301) {
      navigate(localizedPath(`/products/${error.data.slug}`), { replace: true });
    }
  }, [error, navigate, slug]);

  if (isFetching) {
    return (
      <MainLayout>
        <Container className="single-product-container">
          <LoadingSpinner />
        </Container>
      </MainLayout>
    );
  }

  if (error && error.status === 301) {
    return (
      <MainLayout>
        <Container className="single-product-container">
          <LoadingSpinner />
        </Container>
      </MainLayout>
    );
  }

  if (error && error.status === 403) {
    return (
      <TemporaryUnavailablePage />
    );
  }

  if (error) {
    return <NotFoundPage />;
  }

  return <SingleProduct product={data} />;
};
