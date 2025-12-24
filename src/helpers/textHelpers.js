export const capitalizeFirstLetter = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export const isBlank = (string) => [undefined, null, ''].includes(string);

export const removeSpaces = (string) => string.replace(/ /g, '');

export const transformName = (name) => (
  typeof (name) === 'string' ? name.replaceAll(' ', '')
    .replaceAll('/', '')
    .replaceAll('-', '')
    .replaceAll('_', '')
    .replaceAll('&', '')
    .toLowerCase() : name
);
