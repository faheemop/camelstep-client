import React, { useEffect, useRef, useState } from 'react';
import { useOutsideClick } from '../../hooks/useOutsideClick';

import './customDropdown.scss';

export const CustomDropdown = ({
  value, options, id, onChange, onFocus, onBlur,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value);
  const [allOptions] = useState(options.filter((opt) => opt));
  const valueRef = useRef();
  const buttonRef = useRef();
  const dropdownContainerRef = useRef();
  const toggling = () => {
    buttonRef.current.focus();
    setIsOpen(!isOpen);
  };

  const onOptionClicked = (val) => {
    setSelectedOption(val);
    setIsOpen(false);
    buttonRef.current.focus();
  };

  const handleKeyDown = (index) => (e) => {
    switch (e.key) {
      case ' ':
      case 'SpaceBar':
        e.preventDefault();
        setSelectedOption(options[index]);
        break;
      case 'Enter':
        e.preventDefault();
        setSelectedOption(options[index]);
        break;
      default:
        break;
    }
  };

  const handleListKeyDown = (e) => {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedOption(options.indexOf(selectedOption) - 1 >= 0 ? options[options.indexOf(selectedOption) - 1] : options[options.length - 1]);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedOption(selectedOption === options[options.length - 1] ? options[0] : options[options.indexOf(selectedOption) + 1]);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    onChange(valueRef);
  }, [selectedOption]);

  useOutsideClick(dropdownContainerRef, () => setIsOpen(false));

  return (
    <div className="dropdown-container" ref={dropdownContainerRef}>
      <input type="hidden" id={id} value={selectedOption} ref={valueRef} />
      <button
        type="button"
        tabIndex={0}
        className="dropdown-value"
        onClick={() => toggling()}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onKeyDown={handleListKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        id={id}
        ref={buttonRef}
      >
        {selectedOption}
      </button>
      {isOpen && allOptions.length > 0 && (
        <div className="dropdown-options-container">
          <ul className="dropdown-options" role="listbox" tabIndex={-1} onKeyDown={handleListKeyDown}>
            {allOptions.map((option, index) => (
              <li
                className={`dropdown-options__item ${selectedOption === option ? 'selected' : null}`}
                onClick={() => onOptionClicked(option)}
                key={`${option}-${index}`}
                aria-selected={selectedOption === option}
                role="option"
                onKeyDown={handleKeyDown(index)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
