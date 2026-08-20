import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThemeProvider from "../components/theme/ThemeProvider";
import ContentProvider from "../components/content/ContentProvider";
import ScrollToTop from "../components/common/ScrollToTop";
import PublicLayout from "../components/layout/PublicLayout";
import AdminRoute from "../components/admin/AdminRoute";
import AdminLayout from "../components/admin/AdminLayout";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminBookings from "../pages/admin/AdminBookings";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminTheme from "../pages/admin/AdminTheme";
import AdminContent from "../pages/admin/AdminContent";
import AdminSettings from "../pages/admin/AdminSettings";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyResetCode from "../pages/auth/VerifyResetCode";
import NewPassword from "../pages/auth/NewPassword";
import ProductListing from "../pages/shop/ProductListing";
import ProductDetail from "../pages/shop/ProductDetail";
import Checkout from "../pages/checkout/Checkout";
import PaymentVerify from "../pages/checkout/PaymentVerify";
import Consultations from "../pages/consultations/Consultations";
import FashionAcademy from "../pages/academy/FashionAcademy";
import About from "../pages/legal/About";
import Atelier from "../pages/legal/Atelier";
import Press from "../pages/legal/Press";
import Careers from "../pages/legal/Careers";
import Sustainability from "../pages/legal/Sustainability";
import ShippingReturns from "../pages/legal/ShippingReturns";
import CareInstructions from "../pages/legal/CareInstructions";
import PrivacyPolicy from "../pages/legal/PrivacyPolicy";
import TermsOfService from "../pages/legal/TermsOfService";
import CookiePreferences from "../pages/legal/CookiePreferences";
import SizingGuide from "../pages/legal/SizingGuide";
import FAQs from "../pages/legal/FAQs";
import ContactUs from "../pages/legal/ContactUs";
import Unsubscribe from "../pages/legal/Unsubscribe";
import MyOrders from "../pages/account/MyOrders";
import OrderTracking from "../pages/account/OrderTracking";
import MyBookings from "../pages/account/MyBookings";
import BookingTracking from "../pages/account/BookingTracking";
import AdminInquiries from "../pages/admin/AdminInquiries";

export default function App() {
  return (
    <ThemeProvider>
      <ContentProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Admin area — completely separate, no public site chrome */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="theme" element={<AdminTheme />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="settings" element={<AdminSettings />} />
                            <Route path="inquiries" element={<AdminInquiries />} />

            </Route>

            {/* Public storefront — wrapped in Navbar/Footer/panels */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-reset-code" element={<VerifyResetCode />} />
              <Route path="/new-password" element={<NewPassword />} />
              <Route path="/shop/:category" element={<ProductListing />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment/verify" element={<PaymentVerify />} />
              <Route path="/consultations" element={<Consultations />} />
              <Route path="/academy" element={<FashionAcademy />} />
              <Route path="/about" element={<About />} />
              <Route path="/atelier" element={<Atelier />} />
              <Route path="/press" element={<Press />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/sustainability" element={<Sustainability />} />
              <Route path="/shipping-returns" element={<ShippingReturns />} />
              <Route path="/care-instructions" element={<CareInstructions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/cookie-preferences" element={<CookiePreferences />} />
              <Route path="/sizing-guide" element={<SizingGuide />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              <Route path="/account/orders" element={<MyOrders />} />
              <Route path="/account/orders/:id" element={<OrderTracking />} />
              <Route path="/account/bookings" element={<MyBookings />} />
              <Route path="/account/bookings/:id" element={<BookingTracking />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ContentProvider>
    </ThemeProvider>
  );
}
