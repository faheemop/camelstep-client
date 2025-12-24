import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { Helmet } from "react-helmet";
import {
  useConfirmLoginCodeMutation,
  useSendLoginVerificationCodeMutation,
} from "../services/api";
import { Navbar } from "../components/Navbar/Navbar";
import { PhoneNumberForm } from "./login_page/PhoneNumberForm";
import { VerificationCodeForm } from "./login_page/VerificationCodeForm";
import { CurrentUser } from "../helpers/CurrentUser";
import { cartApi } from "../services/cart";

import "./loginPage.scss";
import { Text } from "../components/Text/Text";
import { GoogleButton } from "../components/common/Button/GoogleButton";
import { localizedPath } from "../helpers/localizedPath";
import { AuthNavbar } from "../components/AuthNavbar/AuthNavbar";

export const LoginPage = () => {
  const { t } = useTranslation("application");
  const location = useLocation();
  const dispatch = useDispatch();
  const defaultStatus = null;
  const messageTimeout = 1000 * 15;

  const [countryCode, setCountryCode] = useState("+966");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [renderVerificationCodeForm, setRenderVerificationCodeForm] =
    useState(false);
  const [code, setCode] = useState("");
  const [sendCode] = useSendLoginVerificationCodeMutation();
  const [confirmCode] = useConfirmLoginCodeMutation();
  const [status, setStatus] = useState(defaultStatus);
  const [captchaToken, setCaptchaToken] = useState("");

  const navigate = useNavigate();

  const handleResendCode = async (phoneNum) => {
    const payloadSchema = {
      session: {
        phone_number: countryCode + phoneNum,
      },
    };

    try {
      await sendCode(payloadSchema);
    } catch (error) {
      setStatus({
        type: "danger",
        message: error?.data?.errors?.phone_number[0],
      });
    }
  };

  const onChangePhoneNumber = ({ target: { value } }) => {
    let result = value.replace(/\D+/g, ""); // keep only digits
    if (["+92", "+966", "+971"].includes(countryCode)) {
      result = result.replace(/^0+/, "");
    }
    setPhoneNumber(result);
  };

  const handleCountryCodeChange = (countryCodeValue) => {
    setCountryCode(countryCodeValue);
  };

  const onSubmitLoginForm = async (e) => {
    e.preventDefault();
    const fullPhoneNumber = countryCode + phoneNumber;

    if (!captchaToken) {
      setStatus({
        type: "danger",
        message: "Captcha not verified",
      });
      return;
    }

    const payloadSchema = {
      session: {
        phone_number: fullPhoneNumber,
        captcha_token: captchaToken,
      },
    };

    try {
      console.log("🚀 OTP send request:", payloadSchema);
      await sendCode(payloadSchema).unwrap();
      setRenderVerificationCodeForm(true);
      setStatus(defaultStatus);
    } catch (err) {
      console.error("❌ Error sending OTP:", err);
      setStatus({
        type: "danger",
        message: err?.data?.errors?.phone_number?.[0] || "Something went wrong",
      });
      setTimeout(() => {
        setStatus(defaultStatus);
      }, messageTimeout);
    }
  };

  const submitCode = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      setStatus({
        type: "danger",
        message: "Captcha not verified",
      });
      return;
    }

    const payloadSchema = {
      session: {
        phone_number: countryCode + phoneNumber,
        otp_code: code,
        captcha_token: captchaToken,
      },
    };
    if (!captchaToken) {
      setStatus({
        type: "danger",
        message: t("login.captchaError"),
      });
      return;
    }
    try {
      const confirmCodeResult = await confirmCode(payloadSchema).unwrap();
      if (confirmCodeResult.data) {
        CurrentUser.set(confirmCodeResult?.data);
      }
      if (location.state !== null) {
        navigate(location.state.prevPath);
      } else {
        navigate(localizedPath("/"));
      }
      dispatch(cartApi.util.invalidateTags(["CartItems"]));
    } catch (err) {
      const error = Object.values(err?.data?.errors)?.[0];
      setStatus({
        type: "danger",
        message: error,
      });
      setTimeout(() => {
        setStatus(defaultStatus);
      }, messageTimeout);
    }
  };

  return (
    <div>
      <Helmet>
        <title>{t("seo.login.title")}</title>
        <meta name="description" content={t("seo.login.description")} />
      </Helmet>
      {/* <Navbar isVisible={false} /> */}
      <AuthNavbar />
      <div className="login-container">
        <div className="login__page-wrapper">
          {renderVerificationCodeForm ? (
            <VerificationCodeForm
              onChangeCode={setCode}
              code={code}
              onSubmitOtpCode={submitCode}
              status={status}
              handleResendCode={handleResendCode}
              phoneNumber={phoneNumber}
              setCaptchaStatus={setCaptchaToken}
            />
          ) : (
            <PhoneNumberForm
              onChangePhoneNumber={onChangePhoneNumber}
              phoneNumber={phoneNumber}
              onSubmitLoginForm={onSubmitLoginForm}
              status={status}
              onChangeCountryCode={handleCountryCodeChange}
              setCaptchaStatus={setCaptchaToken}
            />
          )}
          <div className="login__google">
            <Text type="body1">{t("signIn.or")}</Text>
            <GoogleButton />
          </div>
        </div>
      </div>
    </div>
  );
};
