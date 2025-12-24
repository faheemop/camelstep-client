import { configureStore } from "@reduxjs/toolkit";
import { productsApi } from "./services/products";
import { quizApi } from "./services/quiz";
import { orderFeedbackApi } from "./services/orderFeedback";
import menuReducer from "./features/menu/menuSlice";
import quizReducer from "./features/quiz/quizSlice";
import { cartReducer } from "./features/cart/cartSlice";
import { authApi } from "./services/api";
import authReducer from "./features/auth/authSlice";
import { howToBrewApi } from "./services/howToBrew";
import howToBrewReducer from "./features/howToBrew/howToBrewSlice";
import { productsReducer } from "./features/products/productsSlice";
import { userApi } from "./services/user";
import { userReducer } from "./features/user/userSlice";
import { cartApi } from "./services/cart";
import { checkoutReducer } from "./features/checkout/checkoutSlice";
import { brewingMethodsApi } from "./services/brewingMethods";
import { blogsApi } from "./services/blogs";
import { blogsReducer } from "./features/blogs/blogsSlice";
import { promotionsApi } from "./services/promotions";
import brewingMethodsReducer from "./features/brewingMethods/brewingMethodsSlice";
import brandsReducer from "./features/brands/brandsSlice";
import locationsReducer from "./features/locations/locationSlice";
import { brandsApi } from "./services/brands";
import { locationsApi } from "./services/locations";

export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
    [quizApi.reducerPath]: quizApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [howToBrewApi.reducerPath]: howToBrewApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [orderFeedbackApi.reducerPath]: orderFeedbackApi.reducer,
    [brewingMethodsApi.reducerPath]: brewingMethodsApi.reducer,
    [brandsApi.reducerPath]: brandsApi.reducer,
    [blogsApi.reducerPath]: blogsApi.reducer,
    [locationsApi.reducerPath]: locationsApi.reducer,
    user: userReducer,
    auth: authReducer,
    menu: menuReducer,
    cart: cartReducer,
    quiz: quizReducer,
    howToBrew: howToBrewReducer,
    products: productsReducer,
    checkout: checkoutReducer,
    brewingMethods: brewingMethodsReducer,
    blogs: blogsReducer,
    brands: brandsReducer,
    locations: locationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(productsApi.middleware)
      .concat(authApi.middleware)
      .concat(howToBrewApi.middleware)
      .concat(cartApi.middleware)
      .concat(orderFeedbackApi.middleware)
      .concat(brewingMethodsApi.middleware)
      .concat(blogsApi.middleware)
      .concat(promotionsApi.middleware),
});
