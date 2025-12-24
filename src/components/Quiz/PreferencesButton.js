import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useUpdateProductPreferencesMutation } from '../../services/user';
import { Button } from '../common/Button/Button';
import { Text } from '../Text/Text';
import { useAuth } from '../../hooks/useAuth';
import { localizedPath } from '../../helpers/localizedPath';

const notify = (message, type) => {
  toast(<Text type="subtitle2">{message}</Text>, {
    type,
  });
};

export const PreferencesButton = () => {
  const { t } = useTranslation('application');
  const navigate = useNavigate();
  const user = useAuth();
  const userProductPreferences = useSelector((state) => state.user.productPreferences);
  const answers = useSelector((state) => state.quiz.answers);
  const category = useSelector((state) => state.quiz.category);

  const [updateProductPreferences, { error: isPreferencesUpdateError, isSuccess: isPreferencesUpdateSuccess }] = useUpdateProductPreferencesMutation();

  const handleProductPreferencesUpdate = () => {
    const body = {
      ...(userProductPreferences.tools && userProductPreferences.tools),
      ...(userProductPreferences.coffee && userProductPreferences.coffee),
      ...answers,
    };
    if (!user) {
      localStorage.setItem('tmp-quiz', JSON.stringify(body));
      navigate(localizedPath('/login'), { state: { prevPath: localizedPath('/quiz/final') } });
    } else {
      updateProductPreferences(body);
    }
  };

  useEffect(() => {
    if (!user || !userProductPreferences) return;
    const body = localStorage.getItem('tmp-quiz');
    if (!body) return;
    localStorage.removeItem('tmp-quiz');
    updateProductPreferences({
      ...userProductPreferences.coffee,
      ...userProductPreferences.tools,
      ...JSON.parse(body),
    });
  }, [user, userProductPreferences]);

  useEffect(() => {
    if (isPreferencesUpdateSuccess) {
      notify(t('notifications.preferences.success', { preferenceType: t(`common.${category}`) }), 'success');
    }
  }, [isPreferencesUpdateSuccess]);

  useEffect(() => {
    if (isPreferencesUpdateError) {
      notify(t('notifications.error'), 'error');
    }
  }, [isPreferencesUpdateError]);

  return (
    <Button
      text={t('quiz.savePreferences')}
      style={{ minWidth: '23rem' }}
      type="primary"
      inverted
      onClick={handleProductPreferencesUpdate}
    />
  );
};
