import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '../components/Layout/MainLayout';
import { QuizFlow } from '../components/Quiz/QuizFlow';

import {
  getCategoryQuestions,
} from '../features/quiz/quizSlice';

import { useGetQuestionsQuery } from '../services/quiz';

import './quizPage.scss';

export const QuizPage = () => {
  const { isSuccess } = useGetQuestionsQuery();
  const { t } = useTranslation('application');

  const dispatch = useDispatch();
  const questions = useSelector((state) => state.quiz.categoryQuestions);
  const category = useSelector((state) => state.quiz.category);

  useEffect(() => {
    dispatch(getCategoryQuestions(category));
  }, [isSuccess, category]);

  return (
    <MainLayout fluid className="quiz">
      <Helmet>
        <title>{t('seo.quiz.title')}</title>
        <meta name="description" content={t('seo.quiz.description')} />
      </Helmet>
      {questions.length > 0 && <QuizFlow />}
    </MainLayout>
  );
};
