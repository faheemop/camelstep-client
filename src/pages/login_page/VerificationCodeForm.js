/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Text } from "../../components/Text/Text";
import { Button } from "../../components/common/Button/Button";
import { Alert } from "../../components/common/Alert/Alert";
import { CLOUDFLARE_TURNSTILE_SITE_KEY } from "../../config";

export const VerificationCodeForm = ({
  code,
  onChangeCode,
  onSubmitOtpCode,
  status,
  handleResendCode,
  phoneNumber,
  setCaptchaStatus,
}) => {
  const { i18n, t } = useTranslation("application");
  const currentLanguage = i18n.language;
  const [seconds, setSeconds] = React.useState(60);
  const [resetCaptcha, setResetCaptcha] = useState(false);
  const resendCodeInterval = useRef();
  const inputRef = useRef(null);

  const [otpCode, setOtpCode] = useState(code || "");

  // Sync with parent prop
  useEffect(() => {
    setOtpCode(code || "");
  }, [code]);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6); // Only digits, max 6
    setOtpCode(value);
    onChangeCode(value);
  };

  const handleResend = () => {
    if (seconds === 0) {
      handleResendCode(phoneNumber);
      setSeconds(60);
      clearInterval(resendCodeInterval.current);
      resendCodeInterval.current = setInterval(() => {
        setSeconds((currentSeconds) => currentSeconds - 1);
      }, 1000);
    }
  };

  useEffect(() => {
    resendCodeInterval.current = setInterval(() => {
      setSeconds((currentSeconds) => currentSeconds - 1);
    }, 1000);

    return () => clearInterval(resendCodeInterval.current);
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      clearInterval(resendCodeInterval.current);
    }
  }, [seconds]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // // CAPTCHA setup
  // useEffect(() => {
  //   const onloadTurnstileCallback = () => {
  //     if (window.turnstile) {
  //       window.turnstile.remove("#turnstile-container");
  //     }
  //     window.turnstile.render("#turnstile-container", {
  //       sitekey: CLOUDFLARE_TURNSTILE_SITE_KEY,
  //       theme: "light",
  //       language: currentLanguage === "ar" ? "ar" : "en",
  //       callback(token) {
  //         setCaptchaStatus(token);
  //       },
  //     });
  //   };

  //   if (window.turnstile) {
  //     onloadTurnstileCallback();
  //   } else {
  //     window.onloadTurnstileCallback = onloadTurnstileCallback;
  //   }

  //   return () => {
  //     delete window.onloadTurnstileCallback;
  //   };
  // }, [resetCaptcha]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setResetCaptcha((prev) => !prev);
    onSubmitOtpCode(e);
  };

  return (
    <div className="verification-code-form">
      <Text type="headline3" className="login__header">
        {t("login.numberVerificationHeader")}
      </Text>
      <form onSubmit={handleSubmit} dir="ltr">
        <div className="login__input-container1">
          <input
            ref={inputRef}
            className="login__input-container2"
            type="text"
            name="otpCode"
            inputMode="numeric"
            maxLength="6"
            value={otpCode}
            onChange={handleOtpChange}
            placeholder="000 000"
          />
        </div>
        {/* <div className="turnstile-wrapper">
          <div id="turnstile-container" />
        </div> */}
        <div className="login__form-element1">
          <Text type="body1">
            {t("login.notReceiveVerificationCode")}
            <br />
          </Text>
          <Button
            className="verification-resend"
            onClick={handleResend}
            type="naked"
          >
            {t("forms.otp.resend")}
          </Button>
          <Text type="body1">
            {t("forms.otp.in")} <span>{seconds}</span> {t("forms.otp.seconds")}
          </Text>
        </div>
        <div className="login__form-element">
          <Button
            buttonType="submit"
            text={t("login.confirmCode")}
            type="authPrimary"
            disabled={status?.type === "success"}
          />
        </div>
      </form>
      {status && <Alert type={status.type}>{status.message}</Alert>}
    </div>
  );
};
