import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
/* eslint-disable import/no-unresolved */
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import {
  Col, Container, Row, Visible,
} from 'react-grid-system';
import i18next from 'i18next';
import { Button } from '../common/Button/Button';
import { Text } from '../Text/Text';
import { useMediaQuery } from '../../hooks/useCurrentScreenWidth';
import { OtherProductsItem } from '../OtherProducts/OtherProductsItem';
import { usePostAnswersMutation } from '../../services/quiz';
import { QuizCategoryButtons } from './QuizCategoryButtons';
import Cup from '../../assets/icons/cup.svg';
import { ProductImage } from '../ProductImage/ProductImage';
import { AddToCartButton } from '../common/Button/AddToCartButton';
import { PreferencesButton } from './PreferencesButton';

import './quizEndScreen.scss';
import { RiyalSymbol } from '../RiyalSymbol/RiyalSymbol';
import { localizedPath } from '../../helpers/localizedPath';

export const QuizEndScreen = ({ previousStep }) => {
  const category = useSelector((state) => state.quiz.category);
  const answers = useSelector((state) => state.quiz.answers);
  const moreThan1024 = useMediaQuery('(min-width: 1024px)');
  const moreThan576 = useMediaQuery('(min-width: 576px)');
  const { t } = useTranslation('application');
  const navigate = useNavigate();

  let content;

  const [postAnswers, {
    data, isError, isFetching, isSuccess,
  }] = usePostAnswersMutation();

  useEffect(() => {
    postAnswers(answers);
  }, [i18next.language]);

  const calculateSlidesPerView = () => (moreThan576 ? 3 : 2);

  const returnContent = () => {
    const { similar_items: similarItems, recipe_related_items: recipeRelatedItems } = data[category];

    return (
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={`${category}`}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ height: '100%' }}
        >
          <Container
            fluid
            style={{ height: '100%', paddingTop: '2%', paddingBottom: '2%' }}
            className="quiz-results quiz"
          >
            <Row style={{ height: '100%' }}>
              <Col className="container-grid">
                <div>
                  {moreThan1024 && <QuizCategoryButtons />}
                  <Text
                    type="headline1"
                    highlightedText={`${data[category].promoted_item.name}`}
                    highlight="end"
                    onClick={() => navigate(localizedPath(`/products/${data[category].promoted_item.slug || data[category].promoted_item.id}`))}
                  >
                    {t(`quiz.checkOut.${category}`)}
                    <br />
                  </Text>
                </div>
                <Row style={{ width: '100%', marginLeft: 0, marginRight: 0 }}>
                  <Col
                    xs={12}
                    sm={12}
                    lg={8}
                    className="quiz-results-product"
                    style={{ display: moreThan1024 ? 'flex' : 'block', padding: 0 }}
                  >
                    <div className="quiz-results-product__inner">
                      <a href={localizedPath(`/products/${data[category].promoted_item.slug || data[category].promoted_item.id}`)}>
                        <ProductImage
                          source={data[category].promoted_item.image_url}
                          className="quiz-results-product__image"
                        />
                      </a>
                      {category === 'coffee' && (
                        <Button
                          type="neumorphism"
                          inverted
                          text={t('quiz.howToBrew')}
                          onClick={() => navigate(localizedPath(`/products/${data[category].promoted_item.id}`))}
                        >
                          <Cup />
                        </Button>
                      )}
                    </div>
                    <Visible xs sm md>
                      <div className="quiz-buttons">
                        <Button
                          text={t('common.previous')}
                          type="primary"
                          inverted
                          onClick={() => previousStep()}
                          style={{ minWidth: '23rem' }}
                        />
                        <AddToCartButton
                          hasAddons={data[category].promoted_item.addons}
                          slug={data[category].promoted_item.id}
                          productId={data[category].promoted_item.id}
                          buttonText={(
                            <>
                              {t('quiz.buy')}
                              {' '}
                              <span>
                                <RiyalSymbol size={12} color="white" />
                                {' '}
                                {`${data[category].promoted_item.list_price}`}
                              </span>
                            </>
)}
                          disabled={data[category].promoted_item.tags.findIndex((el) => el.key === 'out_of_stock') >= 0}
                        />
                        <PreferencesButton />
                      </div>
                      <div
                        style={{
                          marginTop: moreThan1024 ? '5%' : '10%',
                          marginBottom: moreThan1024 ? 0 : '10%',
                          textAlign: moreThan1024 ? 'initial' : 'center',
                        }}
                      >
                        <Link to={localizedPath('/')}>
                          <Text type="btn-p" style={{ color: '#00546F' }}>
                            {t('quiz.viewAllCoffees')}
                          </Text>
                        </Link>
                      </div>
                    </Visible>
                  </Col>
                  {similarItems.length > 0 && (
                    <Col
                      xs={12}
                      sm={12}
                      lg={4}
                      className="similar-products other-stuff"
                      style={{ padding: 0 }}
                    >
                      <Text type="caption">{t('quiz.similarCoffees').toUpperCase()}</Text>
                      {moreThan1024 ? (
                        <>
                          {similarItems.slice(0, 2).map((item) => (
                            <OtherProductsItem key={item.id} item={item} />
                          ))}
                        </>
                      ) : (
                        <Swiper
                          slidesPerView={calculateSlidesPerView()}
                          centeredSlides={!moreThan576}
                          loop={!moreThan576}
                        >
                          {data[category].similar_items.slice(0, 3).map((item) => (
                            <SwiperSlide key={item.id}>
                              <OtherProductsItem item={item} />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      )}
                    </Col>
                  )}
                </Row>
                <Visible lg xl xxl>
                  <div>
                    <div className="quiz-buttons">
                      <Button
                        text={t('common.previous')}
                        type="primary"
                        inverted
                        onClick={() => previousStep()}
                        style={{ minWidth: '23rem' }}
                      />
                      <AddToCartButton
                        hasAddons={data[category].promoted_item.addons}
                        slug={data[category].promoted_item.id}
                        productId={data[category].promoted_item.id}
                        buttonText={(
                          <>
                            {t('quiz.buy')}
                            {' '}
                            <span>
                              <RiyalSymbol size={12} color="white" />
                              {' '}
                              {`${data[category].promoted_item.list_price}`}
                            </span>
                          </>
)}
                        disabled={data[category].promoted_item.tags.findIndex((el) => el.key === 'out_of_stock') >= 0}
                      />
                      <PreferencesButton />
                    </div>
                    <div style={{ marginTop: '5%' }}>
                      <Link to={localizedPath('/')}>
                        <Text type="btn-p" style={{ color: '#00546F' }}>
                          {t('quiz.viewAllCoffees')}
                        </Text>
                      </Link>
                    </div>
                  </div>
                </Visible>
                {recipeRelatedItems.length > 0 && (
                  <div
                    className="needed-products other-stuff"
                    style={{ marginTop: !moreThan1024 && '3rem' }}
                  >
                    <Text type="caption">{t('products.youWillNeed').toUpperCase()}</Text>
                    <Swiper
                      slidesPerView={calculateSlidesPerView()}
                      centeredSlides={!moreThan576}
                      loop={!moreThan576}
                      style={{ marginInlineStart: 0, width: moreThan1024 && '80%' }}
                    >
                      {recipeRelatedItems.slice(0, 3).map((item) => (
                        <SwiperSlide key={item.id}>
                          <OtherProductsItem item={item} />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                )}
              </Col>
            </Row>
          </Container>
        </motion.div>
      </AnimatePresence>
    );
  };

  if (isFetching) {
    content = t('common.loading');
  } else if (isError) {
    content = t('common.contentError');
  } else if (!data?.[category]?.promoted_item) {
    content = 'Quiz result is not found';
  } else if (isSuccess) {
    content = returnContent();
  }

  /* eslint-disable react/jsx-no-useless-fragment */
  return <>{content}</>;
};
