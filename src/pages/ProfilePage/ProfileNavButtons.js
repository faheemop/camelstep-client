import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

/* eslint-disable import/no-unresolved */
import { NavLink } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { CheckboxButton } from '../../components/inputs/checkboxButton/CheckboxButton';
import { Button } from '../../components/common/Button/Button';
import { useMediaQuery } from '../../hooks/useCurrentScreenWidth';

const profileNavLinksData = [
  {
    id: 1,
    key: 'details',
    link: 'profile_details',
  },
  {
    id: 2,
    key: 'addresses',
    link: 'addresses',
  },
  {
    id: 3,
    key: 'wishlist',
    link: 'wishlist',
  },
  {
    id: 4,
    key: 'orders',
    link: 'orders_history',
  },
  {
    id: 5,
    key: 'preferences',
    link: 'product_preferences',
  },
  {
    id: 6,
    key: 'notifications',
    link: 'notifications',
  },
];

export const ProfileNavButtons = () => {
  const sliderRef = useRef();
  const moreThan1024 = useMediaQuery('(min-width: 1024px)');
  const { t, i18n } = useTranslation('application', { keyPrefix: 'profile.nav' });

  useEffect(() => {
    if (!sliderRef.current) return;
    const activeEl = document.querySelector('.swiper-wrapper');
    if (!activeEl) return;
    // eslint-disable-next-line immutable/no-mutation
    activeEl.style = 'transform: "translate3d(0,0,0);"';
  }, [i18n.language]);

  if (moreThan1024) {
    return profileNavLinksData.map((link) => (
      <NavLink
        to={link.link}
        key={link.link}
      >
        {({ isActive }) => (
          <Button type="primary" className={isActive ? 'checked' : 'unchecked'}>
            {t(link.key)}
          </Button>
        )}
      </NavLink>
    ));
  }

  return (
    <Swiper
      ref={sliderRef}
      slidesPerView={2}
      centeredSlides
      loop
      spaceBetween={20}
      slideToClickedSlide
      key={i18n.language}
    >
      {profileNavLinksData.map((link) => (
        <SwiperSlide key={link.key}>
          <NavLink to={link.link} key={link.link}>
            {({ isActive }) => (
              <CheckboxButton
                text={t(link.key)}
                type="radio"
                checked={isActive}
                style={{ marginBottom: '10px', fontWeight: '300' }}
                readOnly
              />
            )}
          </NavLink>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
