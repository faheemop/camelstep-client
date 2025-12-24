export const getProfileFormFields = (t) => [
  {
    name: 'firstName',
    label: t('forms.firstName.label'),
    validation: { required: t('forms.firstName.required') },
  },
  {
    name: 'lastName',
    label: t('forms.lastName.label'),
    validation: { required: t('forms.lastName.required') },
  },
  {
    heading: t('profile.nav.email'),
    name: 'email',
    label: t('forms.email.label'),
    validation: {
      required: t('forms.email.requiredMsg'),
      pattern: {
        value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
        message: t('forms.email.validationMsg'),
      },
    },
  },
  {
    heading: t('profile.nav.login'),
    name: 'phoneNumber',
    label: t('forms.phoneNumber.label'),
    validation: {
      required: t('forms.phoneNumber.requiredMsg'),
      pattern: {
        value: /^\+?\d+$/,
        message: t('forms.phoneNumber.validationMsg'),
      },
    },
  },
];
