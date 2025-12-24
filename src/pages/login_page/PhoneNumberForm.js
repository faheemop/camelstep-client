// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { Link } from "react-router-dom";
// import { Alert } from "../../components/common/Alert/Alert";

// import { Button } from "../../components/common/Button/Button";
// import { Text } from "../../components/Text/Text";
// import { countriesList } from "../../shared/countrylist";
// import { localizedPath } from "../../helpers/localizedPath";
// import { CLOUDFLARE_TURNSTILE_SITE_KEY } from "../../config";

// export const PhoneNumberForm = ({
//   onSubmitLoginForm,
//   phoneNumber,
//   onChangePhoneNumber,
//   onChangeCountryCode,
//   setCaptchaStatus,
//   status,
// }) => {
//   const { i18n, t } = useTranslation("application");
//   const currentLanguage = i18n.language;

//   const defaultCountry = countriesList.find(
//     (country) => country.value === "Saudi Arabia"
//   );
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [resetCaptcha, setResetCaptcha] = useState(false);

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//     setSearchTerm("");
//   };

//   const handleCountryClick = (countryValue) => {
//     setSelectedCountry(countryValue);
//     onChangeCountryCode(countryValue.dialCode);
//     setIsDropdownOpen(false);
//     toggleDropdown();
//   };

//   const filteredCountries = countriesList.filter(
//     (country) =>
//       country?.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       country?.dialCode.includes(searchTerm)
//   );

//   // CAPTCHA setup
//   useEffect(() => {
//     const onloadTurnstileCallback = () => {
//       if (window.turnstile) {
//         window.turnstile.remove("#turnstile-container");
//       }
//       window.turnstile.render("#turnstile-container", {
//         sitekey: CLOUDFLARE_TURNSTILE_SITE_KEY,
//         theme: "light",
//         language: currentLanguage === "ar" ? "ar" : "en",
//         callback(token) {
//           setCaptchaStatus(token);
//         },
//       });
//     };

//     if (window.turnstile) {
//       onloadTurnstileCallback();
//     } else {
//       window.onloadTurnstileCallback = onloadTurnstileCallback;
//     }

//     return () => {
//       delete window.onloadTurnstileCallback;
//     };
//   }, []);

//   return (
//     <>
//       <Text type="headline3" className="login__header">
//         {t("login.headerText")}
//       </Text>
//       <form onSubmit={onSubmitLoginForm}>
//         <div className="login__form-element">
//           <div className="login__input-container">
//             <div className="country-code-container">
//               <button
//                 type="button"
//                 className="login__input country-selector-button"
//                 onClick={toggleDropdown}
//               >
//                 <img
//                   src={selectedCountry.flag}
//                   alt={selectedCountry.label}
//                   className="country-flag-icon"
//                 />
//                 <span className="dropdown-arrow-icon">▼</span>
//               </button>
//               {isDropdownOpen && (
//                 <div className="country-code-dropdown">
//                   <input
//                     type="text"
//                     className="country-search-input"
//                     placeholder="Search country"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                   <div className="country-list-scrollable">
//                     {filteredCountries.map((eachCountry) => (
//                       <div
//                         className="each-code-container"
//                         key={eachCountry.value}
//                       >
//                         <button
//                           type="button"
//                           className="country-code-button"
//                           onClick={() => handleCountryClick(eachCountry)}
//                         >
//                           {eachCountry.dialCode}
//                           <img src={eachCountry.flag} alt={eachCountry.label} />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//             <span className="country-code">{selectedCountry.dialCode}</span>
//             <input
//               className="login__input phone-number"
//               type="tel"
//               name="phoneNumber"
//               value={phoneNumber}
//               onChange={onChangePhoneNumber}
//               placeholder={"0000 0000"}
//               dir="ltr"
//               inputMode="tel"
//               maxLength={12}
//             />
//           </div>
//         </div>
//         <div className="login__form-element">
//           <Text type="body2">
//             {t("login.agreementTextPartOne")}
//             <br />
//             <Link to={localizedPath("/policy")}>
//               {t("login.agreementLink")}
//             </Link>
//             <br />
//             {t("login.agreementTextPartTwo")}
//           </Text>
//         </div>
//         <div className="turnstile-wrapper">
//           <div id="turnstile-container" />
//         </div>
//         <div className="login__form-element">
//           <Button
//             buttonType="submit"
//             text={t("login.signIn")}
//             type="authPrimary"
//           />
//         </div>
//       </form>
//       {status && <Alert type={status.type}>{t("login.phoneError")}</Alert>}
//     </>
//   );
// };

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Alert } from "../../components/common/Alert/Alert";

import { Button } from "../../components/common/Button/Button";
import { Text } from "../../components/Text/Text";
import { countriesList } from "../../shared/countrylist";
import { localizedPath } from "../../helpers/localizedPath";
import { CLOUDFLARE_TURNSTILE_SITE_KEY } from "../../config";

export const PhoneNumberForm = ({
  onSubmitLoginForm,
  phoneNumber,
  onChangePhoneNumber,
  onChangeCountryCode,
  setCaptchaStatus,
  status,
}) => {
  const { i18n, t } = useTranslation("application");
  const currentLanguage = i18n.language;

  const defaultCountry = countriesList.find(
    (country) => country.value === "Saudi Arabia"
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [searchTerm, setSearchTerm] = useState("");
  const [resetCaptcha, setResetCaptcha] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setSearchTerm("");
  };

  const handleCountryClick = (countryValue) => {
    setSelectedCountry(countryValue);
    onChangeCountryCode(countryValue.dialCode);
    setIsDropdownOpen(false);
    toggleDropdown();
  };

  const filteredCountries = countriesList.filter(
    (country) =>
      country?.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country?.dialCode.includes(searchTerm)
  );

  // CAPTCHA setup
  useEffect(() => {
    const onloadTurnstileCallback = () => {
      if (window.turnstile) {
        window.turnstile.remove("#turnstile-container");
      }
      window.turnstile.render("#turnstile-container", {
        sitekey: CLOUDFLARE_TURNSTILE_SITE_KEY,
        theme: "light",
        language: currentLanguage === "ar" ? "ar" : "en",
        callback(token) {
          setCaptchaStatus(token);
        },
      });
    };

    if (window.turnstile) {
      onloadTurnstileCallback();
    } else {
      window.onloadTurnstileCallback = onloadTurnstileCallback;
    }

    return () => {
      delete window.onloadTurnstileCallback;
    };
  }, [currentLanguage]);

  return (
    <>
      <Text type="headline3" className="login__header">
        {t("login.headerText")}
      </Text>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitLoginForm(e);
          // setResetCaptcha(true); // reset captcha on each submit attempt
        }}
      >
        <div className="login__form-element">
          <div className="login__input-container">
            <div className="country-code-container">
              <button
                type="button"
                className="login__input country-selector-button"
                onClick={toggleDropdown}
              >
                <img
                  src={selectedCountry.flag}
                  alt={selectedCountry.label}
                  className="country-flag-icon"
                />
                <span className="dropdown-arrow-icon">▼</span>
              </button>
              {isDropdownOpen && (
                <div className="country-code-dropdown">
                  <input
                    type="text"
                    className="country-search-input"
                    placeholder="Search country"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="country-list-scrollable">
                    {filteredCountries.map((eachCountry) => (
                      <div
                        className="each-code-container"
                        key={eachCountry.value}
                      >
                        <button
                          type="button"
                          className="country-code-button"
                          onClick={() => handleCountryClick(eachCountry)}
                        >
                          {eachCountry.dialCode}
                          <img src={eachCountry.flag} alt={eachCountry.label} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <span className="country-code">{selectedCountry.dialCode}</span>
            <input
              className="login__input phone-number"
              type="tel"
              name="phoneNumber"
              value={phoneNumber}
              onChange={onChangePhoneNumber}
              placeholder={"0000 0000"}
              dir="ltr"
              inputMode="tel"
              maxLength={selectedCountry.maxLength}
              minLength={selectedCountry.maxLength}
            />
          </div>
        </div>
        <div className="login__form-element">
          <Text type="body2">
            {t("login.agreementTextPartOne")}
            <br />
            <Link to={localizedPath("/policy")}>
              {t("login.agreementLink")}
            </Link>
            <br />
            {t("login.agreementTextPartTwo")}
          </Text>
        </div>
        <div className="turnstile-wrapper">
          <div id="turnstile-container" />
        </div>
        <div className="login__form-element">
          <Button
            buttonType="submit"
            text={t("login.signIn")}
            type="authPrimary"
          />
        </div>
      </form>
      {status && <Alert type={status.type}>{status.message}</Alert>}
    </>
  );
};
