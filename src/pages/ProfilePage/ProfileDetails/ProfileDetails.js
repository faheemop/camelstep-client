import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { eventBus } from '../../../helpers/eventBus';
import {
  useGetPhoneNumberQuery,
  useGetProfileDetailsQuery,
  useUpdatePersonalDetailsMutation,
  useUpdatePhoneNumberMutation,
} from '../../../services/user';
import { ProfileForm } from './ProfileForm';
import { PhoneNumberValidationForm } from './PhoneNumberValidationForm';
import { LoadingSpinner } from '../../../components/LoadingSpinner/LoadingSpinner';
import './profileDetails.scss';

export const ProfileDetails = () => {
  const { t } = useTranslation('application', { keyPrefix: 'profile' });
  const [searchParams, setSearchParams] = useSearchParams();

  const { isLoading: userDetailsLoading, data: userDetails } = useGetProfileDetailsQuery();
  const { isLoading: phoneNumberLoading, data: phoneNumberData } = useGetPhoneNumberQuery();

  const [updatePhoneNumber, { error: phoneNumberError }] = useUpdatePhoneNumberMutation();
  const [updatePersonalDetails, { error: personal_details_data }] = useUpdatePersonalDetailsMutation();

  const [formStatus, setFormStatus] = useState({
    type: '',
    message: '',
  });

  // eslint-disable-next-line consistent-return
  const handleSubmit = async (values) => {
    const {
      firstName, lastName, email, phoneNumber,
    } = values;

    try {
      let updates = {};

      if (phoneNumber !== phoneNumberData?.phone_number) {
        updatePhoneNumber(phoneNumber)
          .unwrap()
          .then(() => {
            eventBus.publish('modal:open', {
              body: (
                <PhoneNumberValidationForm
                  handleResendCode={updatePhoneNumber}
                  phoneNumber={phoneNumber}
                />
              ),
              alertType: true,
            });
          })
          .catch((err) => {
            console.error(err);
            setFormStatus({
              type: 'danger',
              message: 'Failed to update phone number',
            });
            // eslint-disable-next-line no-useless-return
            return;
          });
      }

      if (firstName !== userDetails?.first_name) {
        updates = { ...updates, first_name: firstName };
      }
      if (lastName !== userDetails?.last_name) {
        updates = { ...updates, last_name: lastName };
      }
      if (email !== userDetails?.email) {
        updates = { ...updates, email };
      }

      if (Object.keys(updates).length > 0) {
        await updatePersonalDetails(updates).unwrap();
        setFormStatus({
          type: 'success',
          message: t('profileDetails.updateSuccess'),
        });
      }
    } catch (error) {
      const errorMessage = Object.values(error?.data?.errors)?.[0]?.[0];
      setFormStatus({
        type: 'danger',
        message: errorMessage,
      });
      console.log(error);
    }
  };

  useEffect(() => {
    const result = searchParams.get('email_confirmation_result');
    let timeOut = null;

    if (result === 'success') {
      setFormStatus({
        type: 'success',
        message: t('emailDetails.updateSuccess'),
      });
      toast(t('emailDetails.updateSuccess'), {
        type: 'success',
      });
    } else if (result === 'failure') {
      setFormStatus({
        type: 'danger',
        message: t('emailDetails.updateFailed'),
      });
      toast(t('emailDetails.updateFailed'), {
        type: 'error',
      });
    }

    setSearchParams('');
    timeOut = setTimeout(() => {
      setFormStatus({ type: '', message: '' });
    }, 15000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [searchParams, setSearchParams, t]);

  if (userDetailsLoading || phoneNumberLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="profile-subpage profile-details">
      <ProfileForm
        onSubmit={handleSubmit}
        firstName={userDetails?.first_name}
        lastName={userDetails?.last_name}
        email={userDetails?.email}
        initialPhoneNumber={phoneNumberData?.phone_number}
        formStatus={formStatus}
        error={personal_details_data?.data?.errors?.phone_number[0] || phoneNumberError?.data?.errors?.phone_number[0]}
      />
    </div>
  );
};
