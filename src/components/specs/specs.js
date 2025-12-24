import React from "react";
import { useTranslation } from "react-i18next";
import "./ProductAttachments.scss";
import { API_ROOT } from "../../config";

export const ProductAttachments = ({ attachments = [] }) => {
  const { t, i18n } = useTranslation("application");

  if (!attachments.length) return null;

  return (
    <div className="product-attachments">
      <h3 className="product-attachments__title">
        {i18n.language === "ar" ? "المواصفات" : "Specifications"}
      </h3>

      {attachments.map((file) => (
        <div key={file.id} className="product-attachments__item">
          <span className="product-attachments__name">{file.name}</span>
          <div className="product-attachments__buttons">
            <a
              href={`${API_ROOT}${file.image_url}`}
              download
              className="download-btn"
            >
              {i18n.language === "ar" ? "تحميل" : "Download"}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};
