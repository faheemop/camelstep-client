import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LinkIcon from '../../assets/icons/linkWhite.svg';
import { useGetAllBlogsQuery } from '../../services/blogs';
import './BlogsSection.scss';

export const BlogsSection = () => {
  const { t, i18n } = useTranslation('application');
  const currentLanguage = i18n.language;

  const { data: blogsData } = useGetAllBlogsQuery({
    page: 1,
    count: 5,
  });

  return (
    <div className="blog-section-wrapper" id="blog-section">
      <div className="blog-section-container">
        <p className="section-label">{t('blogsSection.title')}</p>
        <p className="section-subtitle">{t('blogsSection.subtitle')}</p>
        <div className="blog-cards-section">
          {blogsData?.map((card) => (
            <BlogCard key={card.id} to={`/${currentLanguage}/blogs/${card.slug || card.id}`} imageSrc={card.cover_image_url} currentLanguage={currentLanguage} />
          ))}
        </div>
      </div>
    </div>
  );
};

const BlogCard = ({
  to, imageSrc,
}) => (
  <div className="blog-card">
    <Link to={to} className="card-link">
      <img className="card-image" src={imageSrc} alt="blog-img" />
      <div className="link-icon">
        <LinkIcon />
      </div>
    </Link>
  </div>
);
