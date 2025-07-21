import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import CartItem from "@/components/molecules/CartItem"
import Empty from "@/components/ui/Empty"
import { useCart } from "@/hooks/useCart"

const Cart = () => {
  const navigate = useNavigate()
  const { items, getTotalAmount, getTotalItems, clearCart } = useCart()

  const totalAmount = getTotalAmount()
  const totalItems = getTotalItems()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Empty
          title="आपका कार्ट खाली है"
          message="अभी तक आपने कोई प्रोडक्ट नहीं जोड़ा है। शॉपिंग शुरू करें!"
          actionLabel="शॉपिंग करें"
          action={() => navigate("/categories")}
          icon="ShoppingCart"
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-secondary-800 font-display">
            शॉपिंग कार्ट
          </h1>
          <p className="text-secondary-600">
            {totalItems} आइटम कार्ट में हैं
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={clearCart}
          className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
        >
          <ApperIcon name="Trash2" size={16} />
          कार्ट खाली करें
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}
            </AnimatePresence>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <Link to="/categories">
              <Button variant="outline" className="flex items-center gap-2">
                <ApperIcon name="ArrowLeft" size={16} />
                और शॉपिंग करें
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-card p-6 sticky top-24"
          >
            <h2 className="text-xl font-bold text-secondary-800 mb-4 font-display">
              ऑर्डर सारांश
            </h2>
            
            <div className="space-y-3 border-b pb-4 mb-4">
              <div className="flex justify-between">
                <span className="text-secondary-600">कुल आइटम:</span>
                <span className="font-semibold">{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">सबटोटल:</span>
                <span className="font-semibold">₹{totalAmount.toLocaleString("hi-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">डिलीवरी:</span>
                <span className="text-green-600 font-semibold">मुफ्त</span>
              </div>
            </div>
            
            <div className="flex justify-between text-lg font-bold text-secondary-800 mb-6">
              <span>कुल राशि:</span>
              <span className="text-primary-600">₹{totalAmount.toLocaleString("hi-IN")}</span>
            </div>
            
            <Button
              size="lg"
              onClick={() => navigate("/checkout")}
              className="w-full flex items-center justify-center gap-2 mb-4"
            >
              <ApperIcon name="CreditCard" size={20} />
              चेकआउट करें
            </Button>
            
            {/* Trust Indicators */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-secondary-600">
                <ApperIcon name="Shield" size={16} className="text-green-500" />
                सुरक्षित पेमेंट
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary-600">
                <ApperIcon name="Truck" size={16} className="text-blue-500" />
                तेज़ डिलीवरी
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary-600">
                <ApperIcon name="RotateCcw" size={16} className="text-orange-500" />
                7 दिन रिटर्न पॉलिसी
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Cart