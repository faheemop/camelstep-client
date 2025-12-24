import React, { useRef, useState } from 'react';

import classNames from 'classnames';
import Arrow from '../../../assets/icons/arrow.svg';
import { ExpandableVariant } from './ExpandableVariant';
import { useOutsideClick } from '../../../hooks/useOutsideClick';

import './expandable.scss';

const EXPANDABLE_VARIANTS = {
  accordion: 'accordion',
  dropdown: 'dropdown',
};

export const Expandable = ({
  isInitiallyOpen = false, label, children, variant,
}) => {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);

  const expandableRef = useRef(null);

  useOutsideClick(expandableRef, () => setIsOpen(false));

  return (
    <div className="expandable-wrapper" ref={expandableRef}>
      <button className="expandable__button" type="button" onClick={() => setIsOpen(!isOpen)}>
        {label}
        {variant === EXPANDABLE_VARIANTS.accordion && (
          <span className="expandable__arrow-container">
            <Arrow
              className={classNames({
                expandable__arrow: true,
                'expandable__arrow--fliped': !isOpen,
              })}
            />
          </span>
        )}
      </button>
      <ExpandableVariant variant={variant} isOpen={isOpen}>
        {children}
      </ExpandableVariant>
    </div>
  );
};
