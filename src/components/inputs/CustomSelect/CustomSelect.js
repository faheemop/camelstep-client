import i18next from 'i18next';
import React, { useRef, useState } from 'react';
import { useOutsideClick } from '../../../hooks/useOutsideClick';
import { Text } from '../../Text/Text';

import './customSelect.scss';

export const CustomSelect = ({
  inputName, options, value, setValue, externalHandler, label, defaultValueLabel, subLabel, tagFilterSelect,
}) => {
  const [showOptionsList, setShowOptionsList] = useState(false);
  const inputRef = useRef();
  const customSelectRef = useRef();
  const selectedOption = options && options.find((option) => {
    if (typeof option.value === 'string') {
      return option.value === value;
    }
    return option.value.toString() === value.toString();
  });

  const currentLanguage = i18next.language;
  const isDefault = defaultValueLabel && value === 'none';

  useOutsideClick(customSelectRef, () => setShowOptionsList(false));

  const handleListDisplay = (e) => {
    e.preventDefault();
    setShowOptionsList((prevState) => !prevState);
  };

  const handleOptionClick = (e, option) => {
    const { target } = e;
    if (externalHandler && typeof externalHandler === 'function') {
      externalHandler(option, inputRef.current.name);
    }

    e.preventDefault();
    setValue(target.getAttribute('data-value'), inputRef.current, option);
    setShowOptionsList(false);
  };

  const handleKeyDown = (index) => (e) => {
    switch (e.key) {
      case ' ':
      case 'SpaceBar':
        e.preventDefault();
        setValue(options[index].value, inputRef.current);
        break;
      case 'Enter':
        e.preventDefault();
        setValue(options[index].value, inputRef.current);
        break;
      default:
        break;
    }
  };

  const handleListKeyDown = (e) => {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setShowOptionsList(false);
        break;
      case 'ArrowUp':
        if (!showOptionsList) {
          setShowOptionsList(true);
        } else {
          e.preventDefault();
          setValue(
            options.indexOf(selectedOption) - 1 >= 0
              ? options[options.indexOf(selectedOption) - 1].value
              : options[options.length - 1].value,
            inputRef.current,
          );
        }
        break;
      case 'ArrowDown':
        if (!showOptionsList) {
          setShowOptionsList(true);
        } else {
          e.preventDefault();
          setValue(
            selectedOption === options[options.length - 1]
              ? options[0].value
              : options[options.indexOf(selectedOption) + 1].value,
            inputRef.current,
          );
        }
        break;
      default:
        break;
    }
  };

  const createOptionName = (option) => {
    if (option?.translationName) {
      return option.translationName[currentLanguage];
    }
    return option?.name;
  };

  return (
    <div className="custom-select" ref={customSelectRef}>
      {label && (
        <Text className={`${tagFilterSelect ? 'custom-select__tag' : 'custom-select__label'}`} type="body2">
          {label}
        </Text>
      )}
      <button
        type="button"
        className={`custom-select__value  ${showOptionsList ? 'custom-select__value--active' : ''} ${inputName}`}
        onClick={handleListDisplay}
        onKeyDown={handleListKeyDown}
        name={inputName}
        ref={inputRef}
        value={selectedOption?.value}
        aria-haspopup="listbox"
        aria-expanded={showOptionsList}
      >
        {subLabel && (
          <Text type="subtitle3" className={inputName}>
            {subLabel}
          </Text>
        )}
        {isDefault ? defaultValueLabel : createOptionName(selectedOption)}
        <div className="arrow down" />
      </button>
      {showOptionsList && (
        <ul className="custom-select__options">
          {options.filter((opt) => !opt?.hideFromList).map((option) => (
            <li
              id={option.name}
              name={inputName}
              className={`custom-select__option ${selectedOption?.value === option.value ? 'custom-select__option--selected' : ''} ${inputName}`}
              data-value={option.value}
              key={option.id}
              onClick={(e) => handleOptionClick(e, option)}
              onKeyDown={handleKeyDown(option.index)}
              role="option"
              aria-selected={selectedOption?.value === option.value}
            >
              {createOptionName(option)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
