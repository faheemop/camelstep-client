import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Row, Col } from 'react-grid-system';
import { useDispatch } from 'react-redux';
import { PrimaryProductFilters } from '../PrimaryProductFilters/PrimaryProductFilters';
import { Button } from '../../../components/common/Button/Button';
import { useMediaQuery } from '../../../hooks/useCurrentScreenWidth';
import {
  applyCollectedFilters,
} from '../../../features/products/productsSlice';
import { eventBus } from '../../../helpers/eventBus';
import './productFilters.scss';

export const ProductFilters = () => {
  const { t } = useTranslation('application');
  const dispatch = useDispatch();
  const moreThan1024 = useMediaQuery('(min-width: 1024px)');
  const canApplyFilters = useRef(!!moreThan1024);

  const handleSubmitFilters = () => {
    dispatch(
      applyCollectedFilters(),
    );
    eventBus.publish('overlay:close');
  };

  useEffect(() => {
    Object.assign(canApplyFilters, { current: !!moreThan1024 });
  }, [moreThan1024]);

  return (
    <Row>
      <Col md={12} lg={8}>
        <div className="product-filters" style={{ display: 'flex' }}>
          <PrimaryProductFilters />
        </div>
      </Col>
      {!moreThan1024 && (
      <Col md={12} style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Button
          className="product-filters__submit"
          type="primary"
          text={t('filtering.apply')}
          onClick={handleSubmitFilters}
        />
      </Col>
      )}
    </Row>
  );
};
