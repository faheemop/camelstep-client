import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Visible } from 'react-grid-system';

import { useParams } from 'react-router-dom';
import { QuizEndScreen } from './QuizEndScreen';
import { QuizQuestion } from './QuizQuestion';
import { setQuizCategories } from '../../features/quiz/quizSlice';
import { Stepper } from '../Stepper/Stepper';
import { QuizCategoryButtons } from './QuizCategoryButtons';
import { useAuth } from '../../hooks/useAuth';
import { useGetProductPreferencesQuery } from '../../services/user';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';

const mockData = [
  {
    quiz_type: 'coffee',
    param: 'major_note',
    text: 'What taste do you like?',
    translationName: {
      en: 'What taste do you like?',
      ar: 'كيف تفضل مذاق قهوتك؟',
    },
    choices: [
      { en: 'Fruity', ar: 'فاكهي ', img: 'fruity' },
      { en: 'Floral', ar: 'عطري ', img: 'floral' },
      { en: 'Sweet', ar: 'حلو', img: 'sweet' },
      { en: 'Other', ar: 'أخرى', img: 'other' },
      { en: 'Green/vegetative', ar: 'عشبي', img: 'green' },
      { en: 'Sour/fermented', ar: 'حامض/ مخمر', img: 'sour' },
      { en: 'Nutty/cocoa', ar: 'مكسرات / كاكاو', img: 'nutty' },
      { en: 'Spices', ar: 'بهارات', img: 'spices' },
      { en: 'Roasted', ar: 'محمص ', img: 'roasted' },
      // { en: 'Nuts', ar: 'مكسرات ' },
      // { en: 'Classic', ar: 'كلاسيك ' },
      // { en: 'Rich', ar: 'غنية ' },
      // { en: 'Light', ar: 'خفيفة ' },
    ],
  },
  {
    quiz_type: 'coffee',
    param: 'brewing_method',
    text: 'How do you like your coffee?',
    translationName: {
      en: 'How do you like your coffee?',
      ar: 'كيف تفضل طريقة إعداد قهوتك؟',
    },
    choices: [
      { en: 'Espresso', ar: 'اسبريسو', img: 'espresso' },
      { en: 'Black/Drip', ar: 'قهوة سوداء/ مقطرة', img: 'black' },
      { en: 'Cold brew', ar: 'مقطرة باردة', img: 'cold-brew' },
      { en: 'Turkish', ar: 'تركية ', img: 'turkish' },
      { en: 'Saudi', ar: 'سعودية ', img: 'saudi' },
      { en: 'Milk-based', ar: 'مع الحليب', img: 'milk-based' },
      // { en: 'Cold Drip Coffee', ar: 'قهوة مقطرة باردة ' },
    ],
  },
  {
    quiz_type: 'coffee',
    param: 'country',
    text: 'From which country?',
    translationName: {
      en: 'From which country?',
      ar: 'ماهو مصدر القهوة المفضل لديك؟',
    },
    choices: [
      { en: 'Brazil', ar: 'البرازيل ', img: 'brazil' },
      { en: 'Burundi', ar: 'بوروندي', img: 'burundi' },
      { en: 'Colombia', ar: 'كولومبيا', img: 'colombia' },
      { en: 'Costa Rica', ar: 'كوستاريكا', img: 'costarica' },
      { en: 'El Salvador', ar: 'السلفادور', img: 'elsalvador' },
      { en: 'Ethiopia', ar: 'اثيوبيا', img: 'ethiopia' },
      { en: 'Honduras', ar: 'هندوراس', img: 'honduras' },
      { en: 'Panama', ar: 'بنما', img: 'panama' },
      { en: 'Yemen', ar: 'اليمن', img: 'yemen' },
    ],
  },
  {
    quiz_type: 'equipment',
    param: 'coffee_type',
    text: 'What do you want to drink?',
    translationName: {
      en: 'What do you want to drink?',
      ar: 'ماذا تود أن تشرب؟',
    },
    choices: [
      { en: 'Black Coffee', ar: 'قهوة سوداء', img: 'black' },
      { en: 'Espresso', ar: 'اسبريسو', img: 'espresso' },
      { en: 'Turkish Coffee', ar: 'قهوة تركية ', img: 'turkish' },
      { en: 'Cold Brew', ar: 'مقطرة باردة', img: 'cold-brew' },
      { en: 'Tea', ar: 'شاهي ' },
    ],
  },
  {
    quiz_type: 'equipment',
    param: 'no_of_cups',
    text: 'How many cups do you usually drink?',
    translationName: {
      en: 'How many cups do you usually drink?',
      ar: 'كم عدد الأكواب التي تشربها يوميًا تقريبًا؟',
    },
    choices: [
      { en: '1', ar: '1' },
      { en: '2', ar: '2' },
      { en: '3', ar: '3' },
      { en: '4', ar: '4' },
      { en: 'Other', ar: 'أخرى', value: 'more' },
    ],
  },
  {
    quiz_type: 'equipment',
    param: 'place',
    text: 'Where will you be making coffee?',
    translationName: {
      en: 'Where will you be making coffee?',
      ar: 'أين ستقوم بتحضير قهوتك؟',
    },
    choices: [
      { en: 'Home & Office', ar: 'البيت & المكتب ' },
      { en: 'Travel', ar: 'أثناء السفر' },
    ],
  },
].map((question) => ({
  ...question,
  choices: question.choices.map((opt) => ({ ...opt, value: opt?.value || opt.en })),
}));

export const QuizFlow = () => {
  const dispatch = useDispatch();
  const category = useSelector((state) => state.quiz.category);
  const [questions, setQuestions] = useState(mockData);
  const [allQuestions] = useState(mockData);
  const user = useAuth();
  const [skip, setSkip] = useState(true);
  const { data, isLoading } = useGetProductPreferencesQuery(undefined, { skip });
  const { step } = useParams();

  /**
   *
   */
  function checkIfRedirectToFinal() {
    if (!questions || !data) return 1;
    const isFinalStep = step === 'final';
    const haveQuizTypeOptions = questions.map((q) => data[q.param]);

    return isFinalStep && !haveQuizTypeOptions.includes('') ? 4 : 1;
  }

  const getQuizTypes = () => {
    const quizTypes = [];
    allQuestions.forEach((question) => {
      if (!quizTypes.includes(question.quiz_type)) {
        quizTypes.push(question.quiz_type);
      }
    });
    return quizTypes;
  };

  useEffect(() => {
    const quizTypes = getQuizTypes();
    dispatch(setQuizCategories(quizTypes));
  }, []);

  useEffect(() => {
    setQuestions(allQuestions.filter((q) => q.quiz_type === category));
  }, [category]);

  useEffect(() => {
    if (user) {
      setSkip(false);
    }
  }, [user]);

  return isLoading ? <LoadingSpinner /> : (
    <div
      className="quiz"
      style={{
        display: 'flex', flexDirection: 'column', height: '100%', flexGrow: 1,
      }}
    >
      <Visible xs sm md>
        <QuizCategoryButtons />
      </Visible>
      <Stepper layout="horizontal" defaultStep={checkIfRedirectToFinal()}>
        <QuizQuestion question={questions[0]} />
        <QuizQuestion question={questions[1]} />
        <QuizQuestion question={questions[2]} />
        <QuizEndScreen />
      </Stepper>
    </div>
  );
};
