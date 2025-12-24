import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import './text.scss';

export const Text = ({
  type, children, highlightedText, tag, ...args
}) => {
  const selectTag = (textType) => {
    switch (true) {
      case textType === 'headline1':
        return 'h1';
      case textType === 'headline2':
        return 'h2';
      case textType === 'headline3':
        return 'h3';
      case textType === 'subtitle1':
        return 'h4';
      case textType === 'subtitle2':
        return 'h5';
      case textType.includes('body'):
        return 'p';
      case textType === 'raw':
        return 'raw';
      case textType === 'caption':
        return 'p';
      case textType === 'overline':
        return 'p';
      default:
        return 'span';
    }
  };

  const CustomTag = tag || selectTag(type);

  const calcClassNames = () => {
    const textClasses = classNames({
      text: true,
      'text-btn': type.includes('btn'),
      'text-body': type.includes('body'),
      'text-headline--primary': type === 'headline1',
      'text-headline--secondary': type === 'headline2',
      'text-headline--tertiary': type === 'headline3',
      'text-subtitle': type.includes('subtitle'),
      'text-subtitle--primary': type === 'subtitle1',
      'text-subtitle--secondary': type === 'subtitle2',
      'text-body--primary': type === 'body1',
      'text-body--secondary': type === 'body2',
      'text-body--third': type === 'body4',
      'text-caption': type === 'caption',
      'text-overline': type === 'overline',
      'text-btn--p': type === 'btn-p',
      'text-btn--s': type === 'btn-s',
    });

    return `${textClasses} ${args.className ? args.className : ''}`;
  };

  Text.propTypes = { //eslint-disable-line
    type: PropTypes.oneOf([
      'headline1',
      'headline2',
      'headline3',
      'subtitle1',
      'subtitle2',
      'btn-p',
      'btn-s',
      'body1',
      'body2',
      'body3',
      'body4',
      'caption',
      'overline',
      'raw',
    ]),
    highlightedText: PropTypes.string,
  };

  Text.defaultProps = { //eslint-disable-line
    type: 'raw',
    highlightedText: '',
  };

  if (CustomTag === 'h1') {
    if (args.highlight === 'start') {
      return (
        <CustomTag style={args.style} className={calcClassNames()}>
          <span style={{ color: '#A0845F' }}>{highlightedText}</span>
          {children}
        </CustomTag>
      );
    }
    if (args.highlight === 'end') {
      return (
        <CustomTag style={args.style} className={calcClassNames()}>
          {children}
          <span style={{ color: '#A0845F' }}>{highlightedText}</span>
        </CustomTag>
      );
    }
  } else if (CustomTag === 'raw') {
    return { children };
  } else {
    return <CustomTag style={args.style} className={calcClassNames()}>{children}</CustomTag>;
  }

  return null;
};
