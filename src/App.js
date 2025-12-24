import React from 'react';
import {
  Routes,
  Route,
} from 'react-router-dom';
import { setConfiguration } from 'react-grid-system';
import { LoginPage } from './pages/LoginPage';
import { ProductsPage } from './pages/ProductsPage/ProductsPage';
import { QuizPage } from './pages/QuizPage';
import { HowToBrewPage } from './pages/HowToBrew/HowToBrewPage';
import { OrderFeedback } from './pages/OrderFeedback/OrderFeedback';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';
import { ProtectedRoute } from './helpers/protectedRoute';
import { ProfileDetails } from './pages/ProfilePage/ProfileDetails/ProfileDetails';
import { Addresses } from './pages/ProfilePage/Addresses/Addresses';
import { OrdersHistory } from './pages/ProfilePage/OrdersHistory/OrdersHistory';
import { ProductPreferences } from './pages/ProfilePage/ProductPreferences/ProductPreferences';
import { Notifications } from './pages/ProfilePage/Notifications/Notifications';
import { Wishlist } from './pages/ProfilePage/Wishlist/Wishlist';
import { PaymentSummary } from './pages/Payment/PaymentSummary';
import { OrderSummaryContainer } from './pages/Order/OrderSummaryContainer';
import { NotFoundPage } from './pages/404NotFound/NotFoundPage';
import { ProductPage } from './pages/SingleProduct/ProductPage';
import { PackagePage } from './pages/SinglePackage/PackagePage';
import { CheckoutPage } from './pages/Checkout/CheckoutPage';
import 'react-toastify/dist/ReactToastify.css';
import { ErrorPage } from './pages/Error/ErrorPage';
import { BlogDescription } from './pages/BlogDescription';
import { AboutUs } from './pages/StaticPages/AboutUs';
import { Blog } from './pages/Blog';
import { Privacy } from './pages/StaticPages/Privacy';
import { FaqPage } from './pages/StaticPages/Faq';
import { Contact } from './pages/Contact/Contact';
import { Locations } from './pages/Locations/Locations';
import { PaymentTextPage } from './pages/PaymentText';
import { RedirectToDefaultLanguage } from './components/RedirectToDefaultLanguage';
import { LanguageLayout } from './components/LanguageLayout';
import { localizedPath } from './helpers/localizedPath';

setConfiguration({
  breakpoints: [576, 768, 1024, 1200, 1600],
});

/**
 * App root component
 *
 *
 * @returns {HTMLElement} Returns app root element
 */
export const App = () => (
  <div className="App">
    <Routes>
      <Route path="/" element={<RedirectToDefaultLanguage />} />
      <Route path="/:lang" element={<LanguageLayout />}>
        <Route index element={<ProductsPage />} />
        <Route path="quiz/:step" element={<QuizPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="products">
          <Route index element={<ProductsPage />} />
          <Route path=":slug" element={<ProductPage />} />
        </Route>
        <Route path="packages/:packageId" element={<PackagePage />} />
        <Route path="how_to_brew" element={<HowToBrewPage />}>
          <Route index element={<HowToBrewPage />} />
          <Route path=":productId" element={<HowToBrewPage />} />
        </Route>
        <Route
          path="profile"
          element={
            (
              <ProtectedRoute redirectTo={localizedPath('login')}>
                <ProfilePage />
              </ProtectedRoute>
            )
          }
        >
          <Route path="profile_details" element={<ProfileDetails />} />
          <Route path="addresses" element={<Addresses />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="orders_history" element={<OrdersHistory />} />
          <Route path="product_preferences" element={<ProductPreferences />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
        <Route path="payment/validate" element={<PaymentSummary />} />
        <Route path="order_feedback/:token" element={<OrderFeedback />} />
        <Route
          path="checkout"
          element={
            (
              <ProtectedRoute redirectTo={localizedPath('login')}>
                <CheckoutPage />
              </ProtectedRoute>
            )
          }
        />
        <Route
          path="profile_details/orders/:id"
          element={<OrderSummaryContainer type="history" />}
        />
        <Route path="about_us" element={<AboutUs />} />
        <Route path="policy" element={<Privacy />} />
        <Route path="blogs" element={<Blog />} />
        <Route path="blogs/:slug" element={<BlogDescription />} />
        <Route path="locations" element={<Locations />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="contact" element={<Contact />} />
        <Route path="error" element={<ErrorPage />} />
        <Route path="payment-text" element={<PaymentTextPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </div>
);
