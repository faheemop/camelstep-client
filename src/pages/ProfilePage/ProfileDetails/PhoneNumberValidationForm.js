import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useConfirmNewPhoneNumberMutation } from '../../../services/user';
import { VerificationCodeForm } from '../../login_page/VerificationCodeForm';
import { eventBus } from '../../../helpers/eventBus';

export const PhoneNumberValidationForm = ({ handleResendCode, phoneNumber }) => {
  const { t } = useTranslation('application');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState({
    type: '',
    message: '',
  });
  const [captchaToken, setCaptchaToken] = useState('');
  const [confirmPhoneNumber, { isSuccess, error: otpConfirmError }] = useConfirmNewPhoneNumberMutation();

  useEffect(() => {
    if (otpConfirmError) {
      const error = otpConfirmError?.data?.errors?.otp_code;
      setStatus((prevStatus) => ({
        ...prevStatus,
        type: 'danger',
        message: error instanceof Array ? error[0] : error,
      }));
    }
    if (isSuccess) {
      toast.success(t('forms.phoneNumber.successMsg'));
      eventBus.publish('modal:close');
    }
  }, [otpConfirmError, isSuccess]);

  const submitCode = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      setStatus({
        type: 'danger',
        message: 'Captcha not verified',
      });
      return;
    }

    if (code.trim().length < 6) {
      setStatus((prevStatus) => ({
        ...prevStatus,
        type: 'danger',
        message: t('forms.otp.requiredMsg'),
      }));
      return;
    }
    confirmPhoneNumber(code);
  };

  return (
    <VerificationCodeForm
      onChangeCode={setCode}
      code={code}
      onSubmitOtpCode={submitCode}
      status={status}
      handleResendCode={handleResendCode}
      phoneNumber={phoneNumber}
      setCaptchaStatus={setCaptchaToken}
    />
  );
};
