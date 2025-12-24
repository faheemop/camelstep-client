import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { bourbonCardsData } from '../../utils/bourbonSectionData';
import { localizedPath } from '../../helpers/localizedPath';
import LinkIcon from '../../assets/icons/linkWhite.svg';
import './BourbonSection.scss';

export const BourbonSection = () => {
  const { t } = useTranslation('application');

  return (
    <div className="bourbon-section-wrapper" id="bourbon-section">
      <div className="bourbon-section-container">
        <p className="section-label">{t('bourbonSection.title')}</p>

        <div className="bourbon-cards-section">
          <div className="bourbon-cards-section">
            {bourbonCardsData.map((card) => (
              <BourbonCard key={card.id} to={localizedPath(card.to)} imageSrc={card.imageSrc} title={card.title} subtitle={card.subtitle} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const BourbonCard = ({
  to, imageSrc, title, subtitle,
}) => {
  const { t } = useTranslation('application');
  return (
    <div className="bourbon-card">
      <Link to={to} className="card-link">
        <img className="card-image" src={imageSrc} alt="bourbon-img" />
        <div className="link-icon">
          <LinkIcon />
        </div>
        <div className="card-description">
          <p className="description-title">{t(title)}</p>
          <p className="description-subtitle">{t(subtitle)}</p>
        </div>
      </Link>
    </div>
  );
};
