import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import NewsletterPopup from "../marketing/NewsletterPopup";
import CookieConsentBanner from "../marketing/CookieConsentBanner";
import DashboardPanel from "../dashboard/DashboardPanel";
import CartPanel from "../cart/CartPanel";
import SearchOverlay from "../search/SearchOverlay";

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "var(--navbar-height, 0px)" }}>
        <Outlet />
      </div>
      <Footer />
      <NewsletterPopup />
      <CookieConsentBanner />
      <DashboardPanel />
      <CartPanel />
      <SearchOverlay />
    </>
  );
}
