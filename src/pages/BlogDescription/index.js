import React, { useEffect } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { MainLayout } from '../../components/Layout/MainLayout';
import { Text } from '../../components/Text/Text';
import { useGetSingleBlogQuery } from '../../services/blogs';
import ClockIcon from '../../assets/icons/clock-icon.svg';
import ShareIcon from '../../assets/icons/share-icon.svg';
import ShareIconSecondary from '../../assets/icons/share-secondary.svg';
import LikeIcon from '../../assets/icons/like.svg';
import BackArrow from '../../assets/icons/back-arrow.svg';
import './BlogDescription.scss';
import { NoSearchResultFound } from '../../components/NoSearchResultFound/NoSearchResultFound';
import { copyBlogLinkToClipboard } from '../../utils/blog';
import { Container } from '../../components/Layout/Container';
import { localizedPath } from '../../helpers/localizedPath';

export const BlogDescription = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('application');
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const { slug } = useParams();
  const { data: blog, isLoading, error } = useGetSingleBlogQuery({ slug, lang: currentLanguage });

  const {
    cover_image_url, title,
    subtitle, author_name, author_photo_url,
    original_created_at, estimated_read_time, description,
    topic, seo_title, seo_description, seo_keywords, seo_title_ar, seo_description_ar,
  } = blog || {};

  const contentArray = ReactHtmlParser(description);
  const createdDate = moment(original_created_at).format('DD MMMM');

  const getTranslatedReadTime = () => {
    const number = parseInt(estimated_read_time, 10);
    const numberText = { number: estimated_read_time };
    const getTranslatedTime = (tKey) => t(`blogDescription.${tKey}`, numberText);

    if (number === 1) {
      return getTranslatedTime(currentLanguage === 'ar' ? 'oneMinuteReadArabic' : 'oneMinuteReadEnglish');
    } if (number === 2) {
      return getTranslatedTime(currentLanguage === 'ar' ? 'twoMinutesReadArabic' : 'aboveOneMinutesReadEnglish');
    } if (number >= 3 && number <= 10) {
      return getTranslatedTime(currentLanguage === 'ar' ? 'threeToTenMinutesReadArabic' : 'aboveOneMinutesReadEnglish');
    }

    return getTranslatedTime(currentLanguage === 'ar' ? 'aboveTenMinutesReadArabic' : 'aboveOneMinutesReadEnglish');
  };

  useEffect(() => {
    if (error?.status === 301) {
      navigate(localizedPath(`/blogs/${error.data.slug}`), { replace: true });
    }
  }, [error, navigate, slug]);

  if (error && error.status === 301) {
    return (
      <MainLayout>
        <Container className="single-product-container">
          <LoadingSpinner />
        </Container>
      </MainLayout>
    );
  }

  const seoTitle = currentLanguage === 'en' ? seo_title : seo_title_ar;
  const seoDescription = currentLanguage === 'en' ? seo_description : seo_description_ar;

  return (
    <MainLayout className="blogs-main-layout">
      {isLoading ? (
        <div className="loader-container">
          <LoadingSpinner />
        </div>
      )
        : (
          <>
            <Helmet>
              <title>{seoTitle || title}</title>
              <meta name="description" content={seoDescription || subtitle} />
              <meta name="keywords" content={seo_keywords} />
            </Helmet>
            <button type="button" className="going-back-section" onClick={() => navigate('/blogs')}>
              <div className={`icon-container ${currentLanguage === 'ar' && 'arabic'}`}>
                <BackArrow />
              </div>
              <Text
                type="subtitle2"
                className="go-back-text"
              >
                {t('blogDescription.backtoarticles')}
              </Text>
            </button>
            {!blog && <NoSearchResultFound />}
            {!_.isEmpty(blog)
        && (
        <div className="blog-description-container">
          <div className="blog-description-right-container">
            <div className="icon-container-border">
              <div className="icon-container">
                <LikeIcon />
              </div>
            </div>
            <button type="button" className="icon-container-border share-link-button" onClick={(e) => copyBlogLinkToClipboard(e, slug)}>
              <div className="icon-container">
                <ShareIconSecondary />
              </div>
            </button>
          </div>
          <div className="blog-description-data-container">
            <Text type="headline2" className="blog-description-heading">
              {title}
            </Text>
            <Text type="subtitle1" className="blog-description-heading-caption">
              {subtitle}
            </Text>
            <div className="blog-description-data">
              <div className="author-section">
                {author_photo_url
                && (
                <img
                  src={author_photo_url}
                  alt="Blog Author"
                />
                )}
                <div className="author-description">
                  <Text type="subtitle2" className="author-name">
                    {author_name}
                  </Text>
                </div>
              </div>

              <div className="blog-description-meta-data">
                <div className="left-container">
                  <div className="read-time">
                    <div className="clock-icon-container">
                      <ClockIcon />
                    </div>
                    <Text type="subtitle2" className="time-text">
                      {estimated_read_time && getTranslatedReadTime()}
                    </Text>
                  </div>
                  <Text type="subtitle1">{createdDate}</Text>
                  <Text type="subtitle1">{topic}</Text>
                </div>

                <div className="right-container">
                  <button type="button" className="icon-container share-link-button" onClick={(e) => copyBlogLinkToClipboard(e, slug)}>
                    <ShareIcon />
                  </button>
                </div>
              </div>

              <div className="blog-description-data-container">
                <img
                  src={cover_image_url}
                  alt=""
                />

                <div className="text-data">
                  {contentArray}
                </div>

                <div className="blog-description-footer">
                  <div className="blog-description-footer-left">
                    <div className="icon-container-border">
                      <div className="icon-container">
                        <LikeIcon />
                      </div>
                    </div>
                  </div>
                  <div className="blog-description-footer-left">
                    <button type="button" className="icon-container-border share-link-button" onClick={(e) => copyBlogLinkToClipboard(e, slug)}>
                      <div className="icon-container">
                        <ShareIconSecondary />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
          </>
        )}
    </MainLayout>
  );
};
