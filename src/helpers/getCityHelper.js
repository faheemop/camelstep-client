import { capitalize } from 'lodash';

export const getCityList = (citySuggestions, cityInput) => {
  let cityList = [];
  try {
    const parsedCitiesData = citySuggestions?.body
      ? JSON.parse(citySuggestions.body)
      : null;
    const suggestions = parsedCitiesData?.suggestions;
    const cityOptions = suggestions?.map((suggestion) => ({
      label: suggestion.label,
      value: suggestion.label,
    }));
    const cityOption = [
      {
        label: capitalize(cityInput),
        value: capitalize(cityInput),
      },
    ];
    if (cityOptions?.length > 0) cityList = cityOptions;
    else {
      cityList = [];
      cityList = cityOption;
    }
    return cityList;
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};
