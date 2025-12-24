import React, { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import { Button } from '../../components/common/Button/Button';
import { eventBus } from '../../helpers/eventBus';

export const FormStatusWatcher = ({ formRef, newText = '' }) => {
  const { isValid } = useFormikContext();

  useEffect(() => {
    eventBus.publish('payment:form-valid', { disabled: !isValid, formRef, newText });
  }, [isValid]);

  // fallback for safari as it doesn't support requestSubmit
  return (
    <button type="submit" style={{ display: 'none' }}>
      Submit
    </button>
  );
};

export const PaymentButton = ({ text }) => {
  const [disabled, setDisabled] = useState(true);
  const [formEl, setFormEl] = useState(null);
  const [localText, setLocalText] = useState(text);

  const handleClick = () => {
    if (!formEl) return;
    if (formEl.requestSubmit) {
      formEl.requestSubmit();
    } else {
      // fallback for safari as it doesn't support requestSubmit
      formEl.querySelector('button[type="submit"]').click();
    }
  };

  useEffect(() => {
    const btnStatus = eventBus.subscribe('payment:form-valid', (data) => {
      if (data.newText) {
        setLocalText(data.newText);
        return;
      }
      setDisabled(data.disabled);
      setFormEl(data.formRef.current);
    });

    return () => {
      btnStatus.remove();
    };
  }, []);

  useEffect(() => {
    setLocalText(text);
  }, [text]);

  return (
    <Button
      disabled={disabled}
      className="form__submit-btn"
      type="primary"
      buttonType="button"
      text={localText}
      onClick={handleClick}
    />
  );
};
