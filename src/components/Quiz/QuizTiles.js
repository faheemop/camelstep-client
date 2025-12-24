import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { setAnswer } from '../../features/quiz/quizSlice';
import { Text } from '../Text/Text';
import { SvgIcon } from '../common/SvgIcon/SvgIcon';
import { useMediaQuery } from '../../hooks/useCurrentScreenWidth';

import './quizTiles.scss';

export const QuizTiles = ({ quizQuestion, language, nextQuestion }) => {
  const colors = ['#CFBFAB', '#DADADA', '#F6F6F6', '#F2F0EC', '#E8E5E0'];
  const dispatch = useDispatch();
  const answers = useSelector((state) => state.quiz.answers);
  const lessThan1024 = useMediaQuery('(max-width: 1024px)');

  const getNested = (object, ...args) => args.reduce((obj, level) => obj && obj[level], object);

  const handleOptionClick = (option) => {
    const currentAnswer = getNested(answers, quizQuestion.param);
    const answer = {
      param: quizQuestion.param,
      answer: currentAnswer === undefined || currentAnswer !== option ? option : undefined,
    };
    dispatch(setAnswer(answer));
    if (lessThan1024) {
      nextQuestion();
    }
  };

  const getSelected = (option) => {
    const answer = getNested(answers, quizQuestion.param);
    if (answer === option) {
      return true;
    }
    return false;
  };

  const quizTilesClasses = classNames({
    'quiz-tiles': true,
    odd: quizQuestion.choices.length % 2 !== 0,
    many: quizQuestion.choices.length > 8,
  });

  return (
    <div className={quizTilesClasses}>
      {quizQuestion.choices.map((option, idx) => {
        const colorsIndex = idx % colors.length;
        const imageUrl = option?.img ? `/img/quiz/${option.img}.png` : null;
        return (
          <button
            type="button"
            key={idx}
            className={`quiz-tiles__item ${getSelected(option.value) ? 'selected' : ''} ${quizQuestion.param === 'major_note' ? 'capitalize' : ''}`}
            data-idx={colorsIndex}
            style={{ backgroundColor: `${colors[colorsIndex]}` }}
            data-value={option.value}
            onClick={() => handleOptionClick(option.value)}
          >
            {getSelected(option.value) && <SvgIcon id="checkbox" className="checked-icon" />}
            {imageUrl && <img src={imageUrl} alt="quiz-option" className="quiz-tiles__img" />}
            <Text style={{ color: '#00546F' }} type="btn-p">
              {option[language]}
            </Text>
          </button>
        );
      })}
    </div>
  );
};
