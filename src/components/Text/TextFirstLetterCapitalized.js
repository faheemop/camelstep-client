import { capitalizeFirstLetter } from '../../helpers/textHelpers';

export const TextFirstLetterCapitalized = ({ children }) => {
  if (typeof children === 'string') {
    return capitalizeFirstLetter(children);
  }
  return children;
};
