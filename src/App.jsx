import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { TryOnProvider } from './context/TryOnContext.jsx';
import { StoreProvider } from './context/StoreContext.jsx';

import AnnouncementBar from './components/common/AnnouncementBar.jsx';
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import FittingRoomPanel from './components/tryon/FittingRoomPanel.jsx';
import WhatsAppButton from './components/common/WhatsAppButton.jsx';
import MobileBottomNav from './components/common/MobileBottomNav.jsx';
import PWAInstallPrompt from './components/common/PWAInstallPrompt.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import AdminRoute from './components/common/AdminRoute.jsx';
import SuperAdminRoute from './components/common/SuperAdminRoute.jsx';
import AdminPortalRoute from './components/common/AdminPortalRoute.jsx';

// Superadmin & Admin Management Portals
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard.jsx';
import AdminPortalDashboard from './pages/adminPortal/AdminPortalDashboard.jsx';

// Customer Pages
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Profile from './pages/Profile.jsx';
import AboutUs from './pages/AboutUs.jsx';
import ContactUs from './pages/ContactUs.jsx';
import FAQ from './pages/FAQ.jsx';
import ShippingPolicy from './pages/ShippingPolicy.jsx';
import ReturnPolicy from './pages/ReturnPolicy.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsConditions from './pages/TermsConditions.jsx';
import NotFound from './pages/NotFound.jsx';
import AnshuJewellersLanding from './pages/AnshuJewellersLanding.jsx';

// Admin Dashboard Pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminCategories from './pages/admin/AdminCategories.jsx';
import AdminEnquiries from './pages/admin/AdminEnquiries.jsx';
import AdminSubscribers from './pages/admin/AdminSubscribers.jsx';
import AdminTrials from './pages/admin/AdminTrials.jsx';
import AdminPlayground from './pages/admin/AdminPlayground.jsx';
import AdminCredits from './pages/admin/AdminCredits.jsx';
import AdminHelp from './pages/admin/AdminHelp.jsx';

// Scroll to top automatically on route change
function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
}

function AppShell() {
  const location = useLocation();

  // Multi-Domain Tenant Isolation:
  // Detect if current domain is Anshu Jewellers (e.g. anshujewellers.com) OR route /anshu-jewellers
  const rawHostname = typeof window !== 'undefined' ? window.location.hostname.replace(/^www\./, '').toLowerCase() : '';
  const searchParams = new URLSearchParams(location.search);
  const domainOverride = (searchParams.get('domain') || searchParams.get('store') || '').toLowerCase();
  const isAnshuJewellersDomain =
    rawHostname === 'anshu-jewellers-by-uday-jee.vercel.app' ||
    rawHostname.includes('anshu') ||
    rawHostname.includes('uday') ||
    domainOverride.includes('anshu');
  const isAnshuJewellersRoute =
    location.pathname === '/anshu-jewellers' || location.pathname.startsWith('/anshu-jewellers/');
  const isAnshuJewellers = isAnshuJewellersDomain || isAnshuJewellersRoute;

  // 100% ISOLATED JEWELLERY LANDING PAGE: Zero Subh Lagan elements (No Navbar, No Footer, No Saree Try-On)
  if (isAnshuJewellers) {
    return <AnshuJewellersLanding />;
  }

  const isSuperAdminRoute = location.pathname.startsWith('/superadmin');
  const isAdminPortalRoute = location.pathname.startsWith('/admin-portal');
  const isClientAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/client');
  const isDashboardRoute = isSuperAdminRoute || isAdminPortalRoute || isClientAdminRoute;

  return (
    <div className={`min-h-screen flex flex-col ${isDashboardRoute ? 'bg-[#FDFBF7]' : 'bg-cream/30 text-brandText selection:bg-gold/30 selection:text-primary'}`}>
      {!isDashboardRoute && <AnnouncementBar />}
      {!isDashboardRoute && <Navbar />}
      <main className={`flex-1 ${!isDashboardRoute ? 'pb-16 lg:pb-0' : ''}`}>
        <Routes>
          {/* SuperAdmin Master Portal (4 Tabs: Overview, Manage Admin, Manage Client, Profile) */}
          <Route
            path="/superadmin"
            element={
              <SuperAdminRoute>
                <SuperAdminDashboard />
              </SuperAdminRoute>
            }
          />

          {/* Admin Management Portal (3 Tabs: Overview, Manage Client, Profile) */}
          <Route
            path="/admin-portal"
            element={
              <AdminPortalRoute>
                <AdminPortalDashboard />
              </AdminPortalRoute>
            }
          />

          {/* Isolated Landing Pages */}
          <Route path="/anshu-jewellers" element={<AnshuJewellersLanding />} />

          {/* Customer Facing Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/store/:storeSlug" element={<Home />} />
          <Route path="/store/:storeSlug/shop" element={<Shop />} />
          <Route path="/store/:storeSlug/about" element={<AboutUs />} />
          <Route path="/store/:storeSlug/contact" element={<ContactUs />} />
          <Route path="/store/:storeSlug/product/:identifier" element={<ProductDetail />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:identifier" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />

          {/* Client / Admin Control Panel Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/store"
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/sales"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/trials"
            element={
              <AdminRoute>
                <AdminTrials />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/playground"
            element={
              <AdminRoute>
                <AdminPlayground />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/credits"
            element={
              <AdminRoute>
                <AdminCredits />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/help"
            element={
              <AdminRoute>
                <AdminHelp />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/support"
            element={
              <AdminRoute>
                <AdminEnquiries />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <AdminCategories />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/enquiries"
            element={
              <AdminRoute>
                <AdminEnquiries />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/subscribers"
            element={
              <AdminRoute>
                <AdminSubscribers />
              </AdminRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isDashboardRoute && <FittingRoomPanel />}
      {!isDashboardRoute && <WhatsAppButton />}
      {!isDashboardRoute && <MobileBottomNav />}
      {!isDashboardRoute && <PWAInstallPrompt />}
      {!isDashboardRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <TryOnProvider>
              <StoreProvider>
                <ScrollToTop />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 3500,
                    style: {
                      background: '#681B2C',
                      color: '#FFF8EF',
                      border: '1px solid #C6A15B',
                      fontSize: '12px',
                      fontFamily: 'Inter, sans-serif',
                    },
                    success: {
                      iconTheme: {
                        primary: '#C6A15B',
                        secondary: '#681B2C',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#EF4444',
                        secondary: '#FFFFFF',
                      },
                    },
                  }}
                />
                <AppShell />
              </StoreProvider>
            </TryOnProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
