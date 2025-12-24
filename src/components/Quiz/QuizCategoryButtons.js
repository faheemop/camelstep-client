import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { CheckboxButton } from '../inputs/checkboxButton/CheckboxButton';
import { categoryButtons } from './categoryButtonsData';
import { setCategory } from '../../features/quiz/quizSlice';
import { capitalizeFirstLetter } from '../../helpers/textHelpers';

export const QuizCategoryButtons = () => {
  const quizCategories = useSelector((state) => state.quiz.quizCategories);
  const category = useSelector((state) => state.quiz.category);
  const dispatch = useDispatch();
  const { t } = useTranslation('application');

  const handleInputChange = (e) => {
    if (category !== e.target.value) dispatch(setCategory(e.target.value));
  };

  return (
    <div className="btn-wrap">
      {categoryButtons.map((button, index) => (
        <CheckboxButton
          key={button.id}
          text={capitalizeFirstLetter(t(`common.${button.id}`))}
          type={button.type}
          name={button.name}
          id={button.id}
          value={quizCategories[index]}
          currentValue={category}
          onChange={handleInputChange}
          icon={button.icon}
        />
      ))}
    </div>
  );
};
