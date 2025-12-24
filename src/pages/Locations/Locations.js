import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { MainLayout } from "../../components/Layout/MainLayout";
import "./Locations.scss";
import LocationCover from "../../assets/images/locationHeroImage.webp";
import LocationCover2 from "../../assets/images/Locations cover 2.png";
import { BranchCardLocationPage } from "./BranchCardLocationPage";
import { OurBranchesSection } from "../../components/OurBranchesSection/OurBranchesSection";
import { useGetLocationsQuery } from "../../services/locations";

export const Locations = () => {
  const { t, i18n } = useTranslation("application");
  const currentLanguage = i18n.language;
  const { data: locationsData } = useGetLocationsQuery();

  const [selectedCountry, setSelectedCountry] = useState(null);

  const countries = useMemo(() => {
    if (!locationsData?.length) return [];
    const countryList = locationsData.map(branch =>
      currentLanguage === "ar" ? branch.country_ar || branch.country : branch.country
    );
    return [...new Set(countryList.filter(Boolean))];
  }, [locationsData, currentLanguage]);

  useEffect(() => {
    if (countries?.length && !selectedCountry) {
      setSelectedCountry(countries[0]);
    }
  }, [countries, selectedCountry]);

  const filteredBranches = useMemo(() => {
    if (!selectedCountry) return locationsData;
    return locationsData.filter(branch =>
      currentLanguage === "ar"
        ? (branch.country_ar || branch.country) === selectedCountry
        : branch.country === selectedCountry
    );
  }, [locationsData, selectedCountry, currentLanguage]);

  return (
    <MainLayout>
      <div className="locations-hero-section">
        <div className="hero-label-container">
          <div className="hero-label">
            <h1 className="hero-label-title">{t("locationsPage.heroTitle")}</h1>
            <p className="hero-label-subtitle">{t("locationsPage.heroContent")}</p>
          </div>
        </div>
        <div className="hero-section-image-container">
          <img className="hero-section-image" src={LocationCover} alt="locations" />
        </div>
      </div>

      {countries.length > 0 && (
        <div className="branch-selector-container">
          <p className="text-heading">{t("locationsPage.branchesSectionTitle")}</p>
          <div className="branch-countries">
            {countries.map((country, index) => (
              <button
                key={index}
                type="button"
                className={country === selectedCountry ? "clicked" : ""}
                onClick={() => setSelectedCountry(country)}
              >
                {country}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedCountry && (
        <p className="text-heading cards-container-heading">{selectedCountry}</p>
      )}
      <div className="branch-cards-section">
        {filteredBranches?.length && (
          filteredBranches.map((branch, index) => (
            <BranchCardLocationPage key={branch.id || index} branch={branch} />
          ))
        )}
      </div>

      {/* Lower Banner */}
      <div className="locations-lower-banner">
        <div className="lower-banner-label-container">
          <div className="lower-banner-label">
            <h1 className="lower-banner-label-title">

              {t("locationsPage.lowerBannerTitle")}
            </h1>
            <p className="lower-banner-label-subtitle">
              {t("locationsPage.lowerBannerContent")}
            </p>
          </div>
        </div>
        <div className="lower-banner-image-container">
          <img className="lower-banner-image" src={LocationCover2} alt="locations" />
        </div>
      </div>

      {locationsData?.length && <OurBranchesSection locations={locationsData} />}
    </MainLayout>
  );
};
