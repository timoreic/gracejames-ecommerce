import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import PrintsPage from './pages/PrintsPage';
import AboutPage from './pages/AboutPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import MyOrdersPage from './pages/MyOrdersPage';
import ShippingPage from './pages/ShippingPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import OrdersPage from './pages/OrdersPage';
import UsersPage from './pages/UsersPage';
import ProductsPage from './pages/ProductsPage';
import ProductEditPage from './pages/ProductEditPage';
import SizesPage from './pages/SizesPage';
import SizeEditPage from './pages/SizeEditPage';
import MaterialsPage from './pages/MaterialsPage';
import MaterialEditPage from './pages/MaterialEditPage';
import DisplaysPage from './pages/DisplaysPage';
import DisplayEditPage from './pages/DisplayEditPage';

function App() {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/prints" element={<PrintsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/myorders" element={<MyOrdersPage />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/cart/:productId" element={<CartPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/placeorder" element={<PlaceOrderPage />} />
          <Route path="/order/:id" element={<OrderPage />} />

          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/products" element={<ProductsPage />} />
          <Route path="/admin/product/:id/edit" element={<ProductEditPage />} />
          <Route path="/admin/orders" element={<OrdersPage />} />
          <Route path="/admin/sizes" element={<SizesPage />} />
          <Route path="/admin/size/:id/edit" element={<SizeEditPage />} />
          <Route path="/admin/materials" element={<MaterialsPage />} />
          <Route path="/admin/display/:id/edit" element={<DisplayEditPage />} />
          <Route path="/admin/displays" element={<DisplaysPage />} />
          <Route
            path="/admin/material/:id/edit"
            element={<MaterialEditPage />}
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
