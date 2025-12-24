import React from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import 'swiper/swiper-bundle.min.css';
import './Locations.scss';
import { API_ROOT } from '../../config';

SwiperCore.use([Navigation, Pagination]);

export const BranchCardLocationPage = ({ branch }) => {
  const { t, i18n } = useTranslation('application');
  const currentLanguage = i18n.language;

  const {
    cover_image_url,
    display_name,
    display_name_ar,
    street,
    street_ar,
    street2,
    street2_ar,
    link,
  } = branch;

  const name = currentLanguage === 'ar' ? (display_name_ar || display_name) : display_name;
  const address = currentLanguage === 'ar'
    ? `${street_ar ?? ''} ${street2_ar ?? ''}`
    : `${street ?? ''} ${street2 ?? ''}`;

  const getBranchTimings = () => {
    if (!branch?.branch_start_hour || !branch?.branch_end_hour || !branch?.branch_start_period || !branch?.branch_end_period) {
      return t('locationsPage.branchCard.timing');
    }

    return `${branch.branch_start_hour}${branch.branch_start_period} - ${branch.branch_end_hour}${branch.branch_end_period}`;
  }

  const getBranchPickUpTimings = () => {
    if (!branch.pickup_start_hour || !branch.pickup_end_hour || !branch.pickup_start_period || !branch.pickup_end_period) {
      return t('locationsPage.branchCard.timing');
    }

    return `${branch.pickup_start_hour}${branch.pickup_start_period} - ${branch.pickup_end_hour}${branch.pickup_end_period}`;
  }

  return (
    <div className="branch-card-container">
      <div className="branch-card-image-container">
        <Swiper
          className="card-image"
          spaceBetween={10}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation
        >
          <SwiperSlide>
            <img
              className="card-image"
              src={cover_image_url ? `${API_ROOT}${cover_image_url}` : '/default-branch.jpg'}
              alt={name}
            />
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="card-text-box">
        <p className="branch-card-title">{name}</p>
        <p className="branch-card-address">{address}</p>
        <p className="branch-card-timings">
          {`${t('locationsPage.branchCard.everyday')}: ${getBranchTimings()}`}
        </p>
        <p className="branch-card-timings">
          {`${t('locationsPage.branchCard.pickUpTime')}: ${getBranchPickUpTimings()}`}
        </p>
        <button className="branch-card-map" type="button" onClick={() => window.open(link, '_blank')}>
          {t('locationsPage.branchCard.map')}
        </button>
      </div>
    </div>
  );
};
