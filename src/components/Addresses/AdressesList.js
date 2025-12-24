import React from "react";
import { useTranslation } from "react-i18next";
import { Text } from "../Text/Text";
import { AddressBox } from "./AddressBox";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import "./addressesList.scss";
import { capitalizeFirstLetter } from "../../helpers/textHelpers";

export const AdressesList = ({ data, isLoading }) => {
  const { t } = useTranslation("application");
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Exclude billing address
  const groupedAddresses = Object.keys(data).filter(
    (key) =>
      key.toLowerCase() !== "billing" && key.toLowerCase() !== "billingaddress" && key.toLowerCase() !== 'gift' && key.toLowerCase() !== 'giftaddress'
  );

  const singleOrMulti = (type) =>
    data[type].length > 1
      ? t("profile.addresses.addressPurposeTitle", {
          addressPurpose: t(`forms.addressPurpose.${type}`),
        })
      : t(`checkout.${type}Address`);

  return (
    <div className="addressess-list">
      {groupedAddresses.length === 0 && (
        <Text style={{ color: "#373C3D" }} type="headline3">
          {t("profile.addresses.noAddresses")}
        </Text>
      )}
      {groupedAddresses.map((addressPurpose, index) => (
        <div key={`${addressPurpose}-${index}`}>
          <Text style={{ marginBottom: "2rem" }} type="subtitle2">
            {capitalizeFirstLetter(singleOrMulti(addressPurpose))}
          </Text>
          {data[addressPurpose].map((address) => (
            <AddressBox
              key={address.id}
              addressData={address}
              addressPurpose={addressPurpose}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
