import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { localizedPath } from '../../helpers/localizedPath';

import { closeMenu, open } from '../../features/menu/menuSlice';
import { Text } from '../Text/Text';
import CloseIcon from '../../assets/icons/x.svg';

import instagram from '../../assets/icons/social/instagram.jpg';
import youtube from '../../assets/icons/social/youtube.jpg';
import twitter from '../../assets/icons/social/twitter.jpg';
import whatsapp from '../../assets/icons/social/whatsapp.jpg';
import snapchat from '../../assets/icons/social/snapchat.jpg';
import phone from '../../assets/icons/social/phone.jpg';

import './menu.scss';
import { copyToClipboard } from '../../helpers/copyToClipboard';

export const Menu = () => {
  const { t } = useTranslation('application');
  const isOpen = useSelector((state) => state.menu.isOpen);
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isOpen) return;
    dispatch(closeMenu());
  }, [pathname]);

  const handleClick = () => dispatch(closeMenu());

  const NavItem = ({ to, children }) => {
    const isActiveLink = to === pathname;
    const currentElement = isActiveLink ? (
      <button type="button" onClick={handleClick} className="menu__link">
        {children}
      </button>
    ) : (
      <Link to={localizedPath(to)} className="menu__link">
        {children}
      </Link>
    );
    return currentElement;
  };

  return (
    <div className={`menu ${isOpen && 'open'}`}>
      <CloseIcon className="menu__close" onClick={() => dispatch(open())} />
      <nav className="menu__nav">
        <div className="menu__inner">
          <div className="menu__top">
            <Text className="menu__item" type="headline2">
              <NavItem to="/quiz">{t('menu.quiz')}</NavItem>
            </Text>
            <Text className="menu__item" type="headline2">
              <NavItem to="/">{t('menu.products')}</NavItem>
            </Text>
            <Text className="menu__item" type="headline2">
              <NavItem to="/how_to_brew">{t('menu.howToBrew')}</NavItem>
            </Text>
            <Text className="menu__item" type="headline2">
              <Link to={localizedPath('/about_us')} className="menu__link">
                {t('menu.aboutUs')}
              </Link>
            </Text>
            <Text className="menu__item" type="headline2">
              <Link to={localizedPath('/blogs')} className="menu__link">
                {t('menu.blog')}
              </Link>
            </Text>
            <Text className="menu__item" type="headline2">
              <NavItem to="/locations">{t('menu.locations')}</NavItem>
            </Text>
          </div>
          <div className="menu__bottom">
            {/* <Text className="menu__item" type="headline2"><Link to="/" className="menu__link">{t('menu.support')}</Link></Text>
            <Text className="menu__item" type="btn-p"><Link to="/" className="menu__link">{t('menu.terms')}</Link></Text> */}
            <Text className="menu__item" type="btn-p">
              <Link to={localizedPath('/policy')} className="menu__link">
                {t('menu.policy')}
              </Link>
            </Text>
            <Text className="menu__item" type="btn-p">
              <Link to={localizedPath('/faq')} className="menu__link">
                {t('menu.faq')}
              </Link>
            </Text>
            <Text className="menu__item" type="btn-p">
              <Link to={localizedPath('/contact')} className="menu__link">
                {t('menu.contact')}
              </Link>
            </Text>
            {/* <Text className="menu__item" type="btn-p"><Link to="/" className="menu__link">{t('menu.returns')}</Link></Text>
            <Text className="menu__item" type="btn-p"><Link to="/" className="menu__link">{t('menu.help')}</Link></Text> */}
          </div>
        </div>
      </nav>

      <ul className="menu__socials">
        <li>
          <a href={t('footer.instagram')} target="_blank" rel="noreferrer">
            <img src={instagram} alt="Instagram" />
          </a>
        </li>
        <li>
          <a href={t('footer.youtube')} target="_blank" rel="noreferrer">
            <img src={youtube} alt="Youtube" />
          </a>
        </li>
        <li>
          <a href={t('footer.twitter')} target="_blank" rel="noreferrer">
            <img src={twitter} alt="Twitter" />
          </a>
        </li>
        <li>
          <a href={t('footer.snapchat')} target="_blank" rel="noreferrer">
            <img src={snapchat} alt="Snapchat" />
          </a>
        </li>
        <li>
          <a href={t('footer.whatsapp')} target="_blank" rel="noreferrer">
            <img src={whatsapp} alt="Whatsapp" />
          </a>
        </li>
        <li className="non-copy">
          <a href={`tel:${t('footer.tel')}`} target="_blank" rel="noreferrer">
            <img src={phone} alt="Phone" />
          </a>
        </li>
        <li>
          <button
            onClick={copyToClipboard}
            type="button"
            data-type="success"
            data-copy={t('footer.tel')}
            data-msg={t('footer.telCopy')}
          >
            <img src={phone} alt="Phone" />
          </button>
        </li>
      </ul>
    </div>
  );
};
