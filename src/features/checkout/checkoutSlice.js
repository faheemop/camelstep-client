import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../../services/api";

const mapAvailableServices = (services) => {
  const result = services.reduce(
    (accumulator, currentValue) => [...accumulator, currentValue.type],
    []
  );
  return result;
};

const initialState = {
  currentStep: 1,
  isOrderAGift: false,
  addresses: [],
  pickedAddresses: {
    billing: null,
    shipping: null,
    gift: null,
  },
  discountCode: "",
  uncompletedPackages: [],
  shipmentOption: "delivery",
  availableServices: [],
  selectedStore: "none",
  paymentData: {},
  orderPrices: {
    shipmentPrice: null,
    summaryPrice: null,
    totalPrice: null,
  },
  giftMessage: "",
  pendingPayment: false,
  sameAsShippingAddress: true,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      if (state.currentStep === 3) {
        state.pendingPayment = false;
      }
      state.currentStep = action.payload;
    },
    nextCheckoutStep: (state) => {
      state.currentStep += 1;
    },
    prevCheckoutStep: (state) => {
      state.currentStep -= 1;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setValid: (state, action) => {
      state.steps[action.payload - 1].isValid = true;
    },
    toggleIfOrderIsAGift: (state, action) => {
      state.isOrderAGift = action.payload;
    },
    pickAddress: (state, action) => {
      state.pickedAddresses[action.payload.type] = action.payload.address;
      if (
        state.sameAsShippingAddress &&
        (action.payload.type === "shipping" || action.payload.type === "gift")
      ) {
        state.pickedAddresses.billing = action.payload.address;
      }
    },
    resetAddresses: (state) => {
      state.pickedAddresses = initialState.pickedAddresses;
    },
    setUncompletedPackages: (state, action) => {
      state.uncompletedPackages = action.payload;
    },
    setShipmentOption: (state, action) => {
      state.shipmentOption = action.payload;
      state.uncompletedPackages = [];
    },
    setSelectedStore: (state, action) => {
      if (action.payload === "none") {
        state.selectedStore = "none";
      } else {
        state.selectedStore = parseInt(action.payload, 10);
      }
    },
    setPaymentData: (state, action) => {
      state.paymentData = action.payload;
    },
    setOrderPrices: (state, action) => {
      state.orderPrices = { ...state.orderPrices, ...action.payload };
    },
    setDiscountCode: (state, action) => {
      state.discountCode = action.payload;
    },
    setGiftMessage(state, action) {
      state.giftMessage = action.payload;
    },
    setPendingPayment(state, action) {
      state.pendingPayment = action.payload;
    },
    setAvailableServices(state, action) {
      state.availableServices = mapAvailableServices(action.payload);
    },
    toggleIfSameAsShippingAddress: (state, action) => {
      state.sameAsShippingAddress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.logoutUser.matchFulfilled, (state) => {
      Object.assign(state, initialState);
    });
  },
});

export const {
  setCurrentStep,
  nextCheckoutStep,
  prevCheckoutStep,
  setError,
  setValid,
  toggleIfOrderIsAGift,
  pickAddress,
  resetAddresses,
  setUncompletedPackages,
  setShipmentOption,
  setSelectedStore,
  setPaymentData,
  setOrderPrices,
  setGiftMessage,
  setPendingPayment,
  setDiscountCode,
  setAvailableServices,
  sameAsShippingAddress,
  toggleIfSameAsShippingAddress,
} = checkoutSlice.actions;
export const checkoutReducer = checkoutSlice.reducer;
