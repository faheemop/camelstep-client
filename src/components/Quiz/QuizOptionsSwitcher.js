import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setAnswer } from '../../features/quiz/quizSlice';
import { ArrowButton } from '../common/Button/ArrowButton';
import { Text } from '../Text/Text';

export const QuizOptionsSwitcher = ({ question }) => {
  const { t, i18n } = useTranslation('application');
  const { language } = i18n;
  const dispatch = useDispatch();
  const answers = useSelector((state) => state.quiz.answers);
  const [height, setHeight] = useState(0);
  const switcherOptions = [...question.choices];

  const findCurrentIndex = () => {
    const { param } = question;
    const currentAnswer = answers[param];
    const index = switcherOptions.map((el) => (el?.value || el)).indexOf(currentAnswer);
    return index === -1 ? null : index;
  };

  const [switcherIndex, setSwitcherIndex] = useState(() => findCurrentIndex() ?? 0);
  const [isTransitionEnabled, setTransitionEnabled] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [byButton, setByButton] = useState(false);

  const switcherRef = useRef();

  const getNested = (obj, ...args) => args.reduce((objct, level) => objct && objct[level], obj);

  const getSelected = (option) => {
    const answer = answers[question.param];
    return answer === (option?.value || option);
  };

  const answer = getNested(answers, question.param);

  const handleArrowUpClick = () => {
    setByButton(true);
    if (!isTransitioning) {
      setSwitcherIndex((prevState) => prevState - 1);
    }
  };

  const handleArrowDownClick = () => {
    setByButton(true);
    if (!isTransitioning) {
      setSwitcherIndex((prevState) => prevState + 1);
    }
  };

  const handleTransitionEnd = () => {
    let normalizedIndex = switcherIndex;

    if (switcherIndex >= switcherOptions.length) {
      setTransitionEnabled(false);
      normalizedIndex = switcherIndex - switcherOptions.length;
      setSwitcherIndex(normalizedIndex);
    } else if (switcherIndex < 0) {
      setTransitionEnabled(false);
      normalizedIndex = switcherOptions.length + switcherIndex;
      setSwitcherIndex(normalizedIndex);
    }

    const newAnswer = {
      param: question.param,
      answer: switcherOptions[normalizedIndex]?.value || switcherOptions[normalizedIndex],
    };
    dispatch(setAnswer(newAnswer));
    setIsTransitioning(false);
  };

  const moveByShortestPath = (currentIndex, targetIndex) => {
    if (targetIndex === -1) return;
    const itemsLength = switcherOptions.length;
    let distanceUp;
    let distanceDown;

    if (targetIndex === 0) {
      distanceUp = itemsLength - currentIndex;
      distanceDown = currentIndex;
      if (distanceUp < distanceDown) {
        setSwitcherIndex((prevState) => prevState + distanceUp);
      } else {
        setSwitcherIndex((prevState) => prevState - distanceDown);
      }
    } else if (targetIndex > currentIndex) {
      distanceDown = targetIndex - currentIndex;
      distanceUp = switcherOptions.length - distanceDown;
      if (distanceDown < distanceUp) {
        setSwitcherIndex((prevState) => prevState + distanceDown);
      } else {
        setSwitcherIndex((prevState) => prevState - distanceUp);
      }
    } else {
      distanceUp = Math.abs(targetIndex - currentIndex);
      distanceDown = switcherOptions.length - distanceUp;
      if (distanceDown < distanceUp) {
        setSwitcherIndex((prevState) => prevState + distanceDown);
      } else {
        setSwitcherIndex((prevState) => prevState - distanceUp);
      }
    }
  };

  useEffect(() => {
    const currentIndex = switcherIndex;
    const targetIndex = switcherOptions.map((el) => (el?.value || el)).indexOf(answer);

    if (!byButton) {
      if (targetIndex === -1 && currentIndex === 0) {
        setSwitcherIndex(0);
      }
      if (targetIndex === -1 && currentIndex !== 0) {
        moveByShortestPath(currentIndex, 0);
      }
      if (targetIndex !== -1) {
        moveByShortestPath(currentIndex, targetIndex);
      }
    }
    setByButton(false);
  }, [answer]);

  useEffect(() => {
    switcherRef.current.addEventListener('transitionstart', () => {
      setIsTransitioning(true);
    });
  }, []);

  useEffect(() => {
    setTransitionEnabled(true);
  }, [switcherIndex]);

  useEffect(() => {
    const { param } = question;
    const currentAnswer = answers[param];
    if (!currentAnswer && switcherOptions.length > 0) {
      const defaultValue = switcherOptions[0]?.value || switcherOptions[0];
      dispatch(setAnswer({ param, answer: defaultValue }));
    }
  }, [question, answers, dispatch]);

  const quizOptionRef = useCallback((node) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <>
      <div className="option-placeholder">
        <Text type="headline3">
          {t('quiz.selectOption')}
        </Text>
      </div>
      <div className="quiz-options-wrapper" style={{ maxHeight: `${height ? height * 3 : 29}px` }}>
        <div className="quiz-options" style={{ top: `${height}px` }}>
          <div
            className="quiz-options-inner"
            style={{
              transform: `translateY(${switcherIndex * -height}px)`,
              transition: !isTransitionEnabled ? 'none' : undefined,
            }}
            onTransitionEnd={() => {
              handleTransitionEnd();
            }}
            ref={switcherRef}
          >
            {switcherOptions.map((option, idx) => (
              <div
                key={idx}
                className={`quiz-options__item${getSelected(option?.value || option) ? ' selected' : ''} ${question.param === 'major_note' ? 'capitalize' : ''}`}
                data-value={option?.en || option}
                ref={idx === 0 ? quizOptionRef : null}
              >
                <Text type="headline3" style={{ padding: 0 }}>
                  {option[language] || option}
                </Text>
              </div>
            ))}
          </div>
        </div>
        <div className="quiz-options__switcher">
          <ArrowButton direction="up" onClick={() => handleArrowUpClick()} />
          <ArrowButton direction="down" onClick={() => handleArrowDownClick()} />
        </div>
      </div>
    </>
  );
};
