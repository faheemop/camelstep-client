import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
/* eslint-disable import/no-unresolved */
import { Swiper, SwiperSlide } from 'swiper/react';

import { skipToken } from '@reduxjs/toolkit/dist/query';
import { AnimatePresence, motion } from 'framer-motion';
import { useMediaQuery } from '../../../hooks/useCurrentScreenWidth';
import { useGetSpecificRecipeQuery } from '../../../services/howToBrew';
import { OtherProductsItem } from '../../OtherProducts/OtherProductsItem';
import { Text } from '../../Text/Text';

export const OtherProductsSection = () => {
  const { t } = useTranslation('application');
  const activeFilter = useSelector((state) => state.howToBrew.activeFilter);
  const moreThan1024 = useMediaQuery('(min-width: 1024px)');
  const moreThan576 = useMediaQuery('(min-width: 576px)');
  const [productsData, setProductsData] = useState([]);
  const { data = [], isSuccess } = useGetSpecificRecipeQuery(activeFilter ?? skipToken);

  useEffect(() => {
    if (isSuccess) {
      let allNeededProducts = data.recommended_products;
      data.steps.forEach((step) => {
        allNeededProducts = [...allNeededProducts, ...step.products];
      });

      const uniqueNeededProducts = allNeededProducts.filter((product, index, self) => index === self.findIndex((item) => item.id === product.id));

      setProductsData(uniqueNeededProducts);
    }
  }, [data]);

  const calculateSlidesPerView = () => {
    if (moreThan1024) {
      return 6;
    }
    if (!moreThan576) {
      return 2;
    }
    return 3;
  };

  const isCarouselLooped = productsData.length > calculateSlidesPerView();

  if (productsData.length > 0) {
    return (
      <>
        <Text type="body1" style={{ marginBottom: '2rem', textTransform: 'uppercase' }}>
          {t('howToBrew.youWillNeed')}
        </Text>
        <AnimatePresence exitBeforeEnter>
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="other-stuff"
          >
            <Swiper slidesPerView={calculateSlidesPerView()} loop={isCarouselLooped} centeredSlides={!moreThan576}>
              {productsData.map((product, index) => (
                <SwiperSlide key={index}>
                  <OtherProductsItem item={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </AnimatePresence>
      </>
    );
  }
  return null;
};
