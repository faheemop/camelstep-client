import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { Text } from '../Text/Text';
import { Button } from '../common/Button/Button';
import { SvgIcon } from '../common/SvgIcon/SvgIcon';
import { PreferenceItemList } from './PreferenceItemList';
import { capitalizeFirstLetter } from '../../helpers/textHelpers';
import { setCategory } from '../../features/quiz/quizSlice';

import './preferenceContainer.scss';
import { localizedPath } from '../../helpers/localizedPath';

export const PreferenceContainer = ({ preferenceCategory, preferencesData }) => {
  const { t } = useTranslation('application');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const arePreferencesSet = Object.keys(preferencesData).length > 0;

  const redirectToQuiz = () => {
    if (preferenceCategory === 'Tools') {
      navigate(localizedPath('/quiz'));
      dispatch(setCategory('equipment'));
    } else {
      navigate(localizedPath('/quiz'));
      dispatch(setCategory('coffee'));
    }
  };

  const getSvg = (category) => {
    switch (category.toLowerCase()) {
      case 'coffee':
        return <SvgIcon id="icon-coffee-preferences" className="coffee-cup-icon" width={64} height={64} />;
      case 'tools':
        return <SvgIcon id="icon-tools-preferences" className="tool-icon" width={64} height={64} />;
      default:
        return <SvgIcon id="icon-coffee-preferences" className="coffee-cup-icon" width={64} height={64} />;
    }
  };
  return (
    <div className="preference-container" style={{ margin: '5rem 0' }}>
      <Text type="subtitle1">
        {capitalizeFirstLetter(t(`common.${preferenceCategory.toLowerCase()}`))}
        {' '}
        {t('common.preferences')}
      </Text>
      {arePreferencesSet ? (
        <>
          <PreferenceItemList preferencesData={preferencesData} />
          <Button type="primary" text={t('profile.preferences.edit')} onClick={() => navigate(localizedPath('/quiz'))} />
        </>
      ) : (
        <>
          <div className="preference-container__no-preference">
            {getSvg(preferenceCategory)}
            <Text type="subtitle2">{t(`profile.preferences.${preferenceCategory.toLowerCase()}.noPreferences`)}</Text>
          </div>
          <Button className="preference-button" type="primary" text={t(`profile.preferences.${preferenceCategory.toLowerCase()}.button`)} onClick={redirectToQuiz} />
        </>
      )}
    </div>
  );
};
