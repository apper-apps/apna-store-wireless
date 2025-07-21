import React from "react"
import { Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import Home from "@/components/pages/Home"
import Categories from "@/components/pages/Categories"
import ProductDetail from "@/components/pages/ProductDetail"
import Cart from "@/components/pages/Cart"
import Checkout from "@/components/pages/Checkout"
import Orders from "@/components/pages/Orders"
import AdminDashboard from "@/components/pages/AdminDashboard"
import ProductManagement from "@/components/pages/ProductManagement"
import AddProduct from "@/components/pages/AddProduct"
import EditProduct from "@/components/pages/EditProduct"

function App() {
  return (
    <div className="min-h-screen bg-secondary-50">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="categories/:category?" element={<Categories />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<Orders />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/products" element={<ProductManagement />} />
          <Route path="admin/products/add" element={<AddProduct />} />
          <Route path="admin/products/edit/:id" element={<EditProduct />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 9999 }}
      />
    </div>
  )
}

export default App