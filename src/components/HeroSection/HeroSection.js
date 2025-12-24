/* eslint-disable immutable/no-mutation */
import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Text } from '../Text/Text';
import './HeroSection.scss';
import { useGetFeaturedProductsQuery } from '../../services/products';
import { ProductImage } from '../ProductImage/ProductImage';
import { AddToCartButton } from '../common/Button/AddToCartButton';
import { checkIfOutOfStock } from '../../helpers/productHelpers';
import Arrow from '../../assets/icons/arrow.svg';
import { setFeaturedProducts } from '../../features/products/productsSlice';
import { localizedPath } from '../../helpers/localizedPath';

export const HeroSection = () => {
  const { lang } = useParams();
  const prevLangRef = useRef(lang);
  const { t, i18n } = useTranslation('application');
  const dispatch = useDispatch();
  const featuredProducts = useSelector((state) => state.products.featuredProducts);

  const languageChanged = prevLangRef.current !== i18n.language;
  const shouldFetch = featuredProducts.length === 0 || languageChanged;
  const { data: apiData, isSuccess } = useGetFeaturedProductsQuery(
    { lang: i18n.language },
    { skip: !shouldFetch },
  );

  useEffect(() => {
    if (shouldFetch) {
      prevLangRef.current = i18n.language;
    }
  }, [shouldFetch, i18n.language]);

  useEffect(() => {
    if (isSuccess && shouldFetch) {
      dispatch(setFeaturedProducts(apiData));
    }
  }, [apiData, isSuccess, shouldFetch, dispatch]);

  const products = shouldFetch ? apiData : featuredProducts;

  const cardData = [
    {
      label: 'bestSeller',
      product: products?.best_seller,
      type: 'product',
    },
    {
      label: 'popularEquipment',
      product: products?.popular_equipment,
      type: 'product',
    },
    {
      label: 'newCollection',
      product: products?.new_collection,
      type: 'product',
    },
    {
      label: 'famousPackage',
      product: products?.famous_package,
      type: 'package',
    },
  ];

  const filteredCardData = cardData.filter((card) => card.product);
  const scrollContainerRef = useRef(null);
  const cardContainerRef = useRef(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const scroll = (scrollDirection) => {
    let scrollValue = 0;
    const { width } = cardContainerRef.current.getBoundingClientRect();
    if (scrollDirection === 'right') {
      scrollValue = width;
    } else {
      scrollValue = -width;
    }
    scrollContainerRef.current.scrollTo({
      left: scrollContainerRef.current.scrollLeft + scrollValue,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const scrollCurrent = scrollContainerRef.current;
    const checkScrollPosition = () => {
      if (!scrollCurrent) return;
      const { scrollLeft, offsetWidth, scrollWidth } = scrollCurrent;
      if (i18n.language === 'en') {
        setIsAtStart(scrollLeft <= 10);
        setIsAtEnd(scrollLeft + offsetWidth >= scrollWidth - 10);
      } else {
        setIsAtEnd(scrollLeft >= 0);
        setIsAtStart(-scrollLeft + offsetWidth >= scrollWidth - 10);
      }
    };

    checkScrollPosition();
    scrollCurrent.addEventListener('scroll', checkScrollPosition);

    return () => {
      if (scrollCurrent) {
        scrollCurrent.removeEventListener('scroll', checkScrollPosition);
      }
    };
  }, [i18n.language]);

  return (
    <div className="hero-section-wrapper">
      {!isAtStart
        && (
        <button type="button" onClick={() => scroll('left')} className="scroll-button left-button">
          <Arrow />
        </button>
        )}
      {!isAtEnd
        && (
        <button type="button" onClick={() => scroll('right')} className="scroll-button right-button">
          <Arrow />
        </button>
        )}
      <div className="hero-section-container" ref={scrollContainerRef}>
        {filteredCardData.map((card, index) => (
          <FilterCard
            key={card?.id}
            label={t(`heroSection.${card.label}`)}
            product={card.product}
            index={index}
            type={card.type}
            containerRef={cardContainerRef}
          />
        ))}
      </div>
    </div>
  );
};

const FilterCard = ({
  label, type, product, index, containerRef,
}) => {
  const {
    id, name, tags, addons, image_url, cover_image_url, is_purchasable, name_en, name_ar, is_active, slug,
  } = product || {};

  const is_addable = !_.isUndefined(is_active) ? is_active : is_purchasable;

  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const package_name = currentLanguage === 'ar' ? name_ar : name_en;

  return (
    <Link to={localizedPath(`/${type === 'package' ? 'packages' : 'products'}/${slug || id}`)}>
      <div className={`hero-card ${index === 0 ? 'active' : 'hover-animate'}`} ref={index === 0 ? containerRef : null}>
        <Text type="headline2" className="hero-title">{label}</Text>
        <Text type="subtitle1" className="product-label">{name_en ? package_name : name}</Text>
        <div className="product-image">
          <ProductImage source={image_url || cover_image_url} alt="order-product" className="order-product__image" />
        </div>
        <div className="btn-container">
          <AddToCartButton
            disabled={checkIfOutOfStock(tags) || !is_addable}
            buttonType="secondary"
            productId={id}
            hasAddons={addons}
            isPackage={!_.isEmpty(name_en)}
          />
        </div>
      </div>
    </Link>
  );
};
