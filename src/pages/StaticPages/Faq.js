import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { MainLayout } from '../../components/Layout/MainLayout';
import { Text } from '../../components/Text/Text';

import './staticPage.scss';
import { CheckboxButton } from '../../components/inputs/checkboxButton/CheckboxButton';
import { data } from './faqData';

export const FaqPage = () => {
  const { t, i18n } = useTranslation('application');
  const [active, setActive] = useState('0');

  const transformText = (text) => {
    // Split text into words but keep spaces
    const parts = text.split(/(\s+)/);

    return parts.map((part, i) => {
      if (part.includes('@')) {
        const fixMail = part.endsWith('.') ? part.replace('com.', 'com') : part;
        return (
          <a key={i} href={`mailto:${fixMail}`}>
            {fixMail}
          </a>
        );
      }

      if (part.startsWith("http://") || part.startsWith("https://") || part.includes("camelstep.com")) {
        const isExternal = !part.startsWith(window.location.origin) ? { target: "_blank", rel: "noreferrer" } : {}
        return (
          <a key={i} href={part} {...isExternal}>
            {part}
          </a>
        );
      }

      if (/\+?\d{6,}/.test(part.replace(/[\[\]\+]/g, ''))) {
        const phone = part.replace(/[^0-9]/g, '');
        return (
          <a key={i} href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer">
            {part.replace(/[\[\]]/g, '')}
          </a>
        );
      }

      return part;
    });
  };

  // const transformText = (text) => {
  //   const words = text.split(' ');
  //   const email = words.findIndex((w) => w.includes('@'));
  //   const url = words.findIndex((w) => w.includes('https://'));
  //   if (email >= 0) {
  //     const start = words.slice(0, email).join(' ').trim();
  //     const end = words.slice(email + 1).join(' ').trim();
  //     const fixMail = words[email].endsWith('.') ? words[email].replace('com.', 'com') : words[email];
  //     return (
  //       <>
  //         {start}
  //         {' '}
  //         <a href={`mailto:${fixMail}`}>{words[email]}</a>
  //         {' '}
  //         {end}
  //       </>
  //     );
  //   }
  //   if (url >= 0) {
  //     const start = words.slice(0, url).join(' ').trim();
  //     const end = words.slice(url + 1).join(' ').trim();
  //     const isExternal = words[url].startsWith(window.location.origin) ? {} : { target: '_blank', rel: 'noreferrer' };
  //     return (
  //       <>
  //         {start}
  //         {' '}
  //         {/* eslint-disable-next-line react/jsx-props-no-spreading */}
  //         <a href={words[url]} {...isExternal}>{words[url]}</a>
  //         {' '}
  //         {end}
  //       </>
  //     );
  //   }
  //   return text;
  // };

  return (
    <MainLayout className="static_page about_us">
      <Helmet>
        <title>{t('seo.faq.title')}</title>
        <meta name="description" content={t('seo.faq.description')} />
      </Helmet>
      <div className="faq_tabs">
        {data[i18n.language].map((tab, i) => (
          <CheckboxButton
            key={tab.title}
            id={tab.title}
            name={tab.title}
            text={tab.title}
            value={`${i}`}
            currentValue={active}
            onChange={(ev) => setActive(ev.target.value)}
          />
        ))}
      </div>
      <ol className="faq_answers">
        {data[i18n.language][+active].questions.map((q) => (
          <li key={q.q}>
            <Text type="headline3">{q.q}</Text>

            {/* Handle array (bullets) or string (normal text) */}
            {Array.isArray(q.a) ? (
              <ul className="faq_list">
                {q.a.map((item, idx) => (
                  <li key={idx}>
                    <Text type="body1">{transformText(item)}</Text>
                  </li>
                ))}
              </ul>
            ) : (
              <Text type="body1">{transformText(q.a)}</Text>
            )}

            {/* Handle optional note */}
            {q.note && (
              <Text type="body2" className="faq_note">
                {transformText(q.note)}
              </Text>
            )}
          </li>
        ))}
      </ol>
      {/* <ol className="faq_answers">
        {data[i18n.language][+active].questions.map((q) => (
          <li key={q.q}>
            <Text type="headline3">{q.q}</Text>
            <Text type="body1">{transformText(q.a)}</Text>
          </li>
        ))}
      </ol> */}
    </MainLayout>
  );
};
