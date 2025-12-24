import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { MainLayout } from "../../components/Layout/MainLayout";
import { Text } from "../../components/Text/Text";

import "./contact.scss";
import { Button } from "../../components/common/Button/Button";

import "../../components/inputs/MessageBox/MessageBox.scss";

import staticData from "../../translations/en/application.json";
import staticDataAr from "../../translations/ar/application.json";
import { SelectSubject } from "./forms/selectSubject";
import { CareersFields } from "./forms/careersFields";
import { CommonFields } from "./forms/commonFields";
import { MaintenanceFields } from "./forms/maintenanceFields";
import { countriesList } from "../../shared/countrylist";
import { Stepper } from "../../components/Stepper/Stepper";
import { ReturnsFields } from "./forms/returnsSecondForm";
import { AssistWithOnlinePurchase } from "./forms/assistWithOnlinePurchase";
import { ComplaintSubmissionForm } from "./forms/complaintFields";
import { BusinessSalesForm } from "./forms/businessSales";
import { OpportunitiesSubmissionForm } from "./forms/opportunitiesForm";
import { TrainingProgramSubmissionForm } from "./forms/trainingProgramSubmissionForm";
import { OtherInquiriesSubmissionForm } from "./forms/otherInquiryFormSubmission";
import { localizedPath } from "../../helpers/localizedPath";

// eslint-disable-next-line jsdoc/require-jsdoc
function createOptions(activeTab) {
  let ar = staticDataAr.contact[activeTab];
  let en = staticData.contact[activeTab];

  if (activeTab === "complaint" || activeTab === "maintenance") {
    const variants = ["_a", "_b"];
    ar = variants.map((el) => staticDataAr.contact[activeTab + el]);
    en = variants.map((el) => staticData.contact[activeTab + el]);
    return variants.map((_variant, i) =>
      Object.entries(en[i]).map(([key, val]) => ({
        value: key,
        label: val,
        translationName: {
          en: val,
          ar: ar[i][key],
        },
      }))
    );
  }

  return Object.entries(en).map(([key, val]) => ({
    value: key,
    label: val,
    translationName: {
      en: val,
      ar: ar[key],
    },
  }));
}

const RenderStep = (props) => {
  const {
    answers,
    setAnswers,
    t,
    resume,
    invoiceRef,
    photoRef,
    careerOptions,
    setSubmitted,
    currentStep,
    setStep,
  } = props;
  const { msgSubject } = answers;
  if (currentStep === 1)
    return (
      <SelectSubject
        key={currentStep + msgSubject}
        answers={answers}
        options={createOptions("tabs")}
        setAnswers={setAnswers}
        placeholder={t("contact.type.label")}
        nextStep={setStep}
      />
    );
  if (currentStep === 2) {
    return (
      <React.Fragment key={currentStep + msgSubject}>
        {(() => {
          switch (msgSubject) {
            case "career_request":
              return (
                <CareersFields
                  answers={answers}
                  setAnswers={setAnswers}
                  resume={resume}
                  options={careerOptions}
                  nextStep={() => setStep(3)}
                />
              );
            case "maintenance":
              return (
                <MaintenanceFields
                  answers={answers}
                  setAnswers={setAnswers}
                  invoiceRef={invoiceRef}
                  photoRef={photoRef}
                  options={createOptions("maintenance")}
                  nextStep={() => setStep(3)}
                />
              );
            case "partner_request":
            case "assist_online_purchase":
            case "business_sales":
            case "opportunities":
            case "training":
              return (
                <SelectSubject
                  name="type"
                  answers={answers}
                  setAnswers={setAnswers}
                  options={createOptions(msgSubject)}
                  placeholder={t("contact.type.label2")}
                  nextStep={() => setStep(3)}
                />
              );
            case "complaint":
              return (
                <SelectSubject
                  name="type"
                  answers={answers}
                  setAnswers={setAnswers}
                  options={createOptions("complaint")[0]}
                  placeholder={t("contact.type.label3")}
                  nextStep={() => setStep(3)}
                />
              );
            default:
              return <Text type="headline2">{t("contact.prevStep")}</Text>;
          }
        })()}
      </React.Fragment>
    );
  }
  if (currentStep === 3) {
    return (
      <React.Fragment key={currentStep + msgSubject}>
        {(() => {
          switch (msgSubject) {
            case "career_request":
              return (
                <CommonFields
                  setSubmitted={setSubmitted}
                  answers={answers}
                  resume={resume.current}
                  options={countriesList}
                />
              );

            case "returns":
              return (
                <ReturnsFields
                  setSubmitted={setSubmitted}
                  answers={answers}
                  photoRef={photoRef}
                  options={countriesList}
                />
              );

            case "assist_online_purchase":
              return (
                <AssistWithOnlinePurchase
                  setSubmitted={setSubmitted}
                  answers={answers}
                  options={countriesList}
                />
              );

            case "business_sales":
              return (
                <BusinessSalesForm
                  setSubmitted={setSubmitted}
                  answers={answers}
                  options={countriesList}
                />
              );

            case "opportunities":
              return (
                <OpportunitiesSubmissionForm
                  setSubmitted={setSubmitted}
                  answers={answers}
                  options={countriesList}
                  photoRef={photoRef}
                />
              );

            case "training":
              return (
                <TrainingProgramSubmissionForm
                  setSubmitted={setSubmitted}
                  answers={answers}
                  options={countriesList}
                />
              );

            case "other_inquiries":
              return (
                <OtherInquiriesSubmissionForm
                  setSubmitted={setSubmitted}
                  answers={answers}
                  options={countriesList}
                />
              );

            case "maintenance":
              return (
                <CommonFields
                  setSubmitted={setSubmitted}
                  answers={answers}
                  invoiceRef={invoiceRef.current}
                  photoRef={photoRef.current}
                  options={countriesList}
                />
              );

            case "complaint":
              return (
                <ComplaintSubmissionForm
                  setSubmitted={setSubmitted}
                  answers={answers}
                  options={countriesList}
                  photoRef={photoRef}
                />
              );

            default:
              return <Text type="headline2">{t("contact.prevStep")}</Text>;
          }
        })()}
      </React.Fragment>
    );
  }
  return null;
};

export const Contact = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("application");
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});

  const resume = useRef({});
  const invoiceRef = useRef({});
  const photoRef = useRef({});
  const careerOptions = [
    countriesList,
    createOptions("statuses"),
    createOptions("education"),
  ];

  return (
    <MainLayout className="static_page about_us">
      <Helmet>
        <title>{t("seo.contactUs.title")}</title>
        <meta name="description" content={t("seo.contactUs.description")} />
      </Helmet>
      <Text type="headline2">{t("contact.title")}</Text>
      <Text type="body1">{t("contact.header")}</Text>
      {submitted ? (
        <>
          <Text type="body1">{t("contact.thanks")}</Text>
          <Button type="naked" onClick={() => navigate(localizedPath("/"))}>
            {t("notFound.goBackToHomepage")}
          </Button>
        </>
      ) : (
        <Stepper
          layout="horizontal"
          animation={{
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.5 },
          }}
        >
          {["step1", "step2", "step3"].map((val) => (
            <RenderStep
              key={val}
              answers={answers}
              setAnswers={setAnswers}
              t={t}
              resume={resume}
              invoiceRef={invoiceRef}
              photoRef={photoRef}
              careerOptions={careerOptions}
              setSubmitted={setSubmitted}
            />
          ))}
        </Stepper>
      )}
    </MainLayout>
  );
};
