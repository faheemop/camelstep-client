const MOYASAR_DATA_TO_INPUT_FIELD_NAMES = {
  name: 'firstName',
  number: 'cardNumber',
  cvc: 'secureCode',
  month: 'expiryDate',
  year: 'expiryDate',
  mobile: 'phone',
};

export const mapMoyasarApiErrorsToFormErrors = (input) => {
  const result = Object.keys(input).reduce((accumulator, currentValue) => ({
    ...accumulator,
    [MOYASAR_DATA_TO_INPUT_FIELD_NAMES[currentValue]]: input[currentValue].join(', '),
  }), {});
  return result;
};

export const callMoyasarApi = async (moyasarRequestBody, formActions) => {
  const response = await fetch(
    'https://api.moyasar.com/v1/payments',
    {
      method: 'POST',
      body: JSON.stringify(moyasarRequestBody),
      headers: { 'content-type': 'application/json' },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    const errObject = mapMoyasarApiErrorsToFormErrors(result.errors);

    formActions.setErrors(errObject);

    throw Error(result.message);
  }

  return result;
};
