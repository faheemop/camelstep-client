import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { cartApi } from "../../services/cart";
import { useUserOrderLastQuery } from "../../services/user";
import { ErrorPage } from "../Error/ErrorPage";
import { OrderSummary } from "./OrderSummary";
import { setCurrentStep } from "../../features/checkout/checkoutSlice";
import { localizedPath } from "../../helpers/localizedPath";

export const NewOrderContainer = () => {
  const { t } = useTranslation("application");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [refetchTimeExpired, setRefetchTimeExpired] = useState(false);

  const [isError, setIsError] = useState(false);
  const loadingRef = useRef(true);

  const { data: order, error, isLoading, refetch } = useUserOrderLastQuery();

  useEffect(() => {
    if (error && !isError) {
      setIsError(true);
    }
  }, [error]);

  useEffect(() => {
    let refetchInterval;
    if (isError) {
      refetchInterval = setInterval(() => {
        refetch();
      }, 1000);

      setTimeout(() => {
        clearInterval(refetchInterval);
        setRefetchTimeExpired(true);
      }, 30000);
    } else if (refetchInterval) {
      clearInterval(refetchInterval);
    }

    return () => {
      if (refetchInterval) {
        clearInterval(refetchInterval);
      }
    };
  }, [isError]);

  useEffect(() => {
    if (order) {
      dispatch(cartApi.util.invalidateTags(["CartItems"]));

      dispatch(setCurrentStep(1));
    }
  }, [order]);

  /* eslint-disable immutable/no-mutation */
  useEffect(() => {
    if (isLoading && order) {
      loadingRef.current = false;
    }
  }, [isLoading, order]);

  if (order) {
    return <OrderSummary order={order} type="new" />;
  }

  if (isLoading && loadingRef.current) {
    return <LoadingSpinner />;
  }

  if (refetchTimeExpired) {
    return (
      <ErrorPage
        title={t("order.errors.unexpectedError")}
        subtitle={t("order.errors.tryAgainOrContact")}
        message="support@camelstep.com" // TODO: to be swapped with real contact info
        buttonText={t("common.goBackToHomepage")}
        buttonAction={() => navigate(localizedPath("/"))}
      />
    );
  }

  if (error) {
    return (
      <ErrorPage
        title={t("order.errors.paymentServiceProblem")}
        subtitle={
          <span>
            {t("order.errors.waitPaymentProcess")} <LoadingSpinner />
          </span>
        }
      />
    );
  }

  return isLoading && loadingRef.current && <LoadingSpinner />;
};
