import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { useCart } from "@/hooks/useCart"

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart()

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(item.productId)
    } else {
      updateQuantity(item.productId, newQuantity)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="bg-white rounded-xl shadow-card p-4 flex gap-4"
    >
      <img
        src={item.imageUrl}
        alt={item.nameHindi || item.name}
        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
      />
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-secondary-800 mb-1 line-clamp-2">
          {item.nameHindi || item.name}
        </h3>
        <p className="text-lg font-bold text-primary-600 mb-2">
          ₹{item.price.toLocaleString("hi-IN")}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="w-8 h-8 p-0 rounded-full"
            >
              <ApperIcon name="Minus" size={14} />
            </Button>
            <span className="font-semibold text-secondary-800 min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="w-8 h-8 p-0 rounded-full"
            >
              <ApperIcon name="Plus" size={14} />
            </Button>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => removeFromCart(item.productId)}
            className="text-red-500 hover:bg-red-50 p-2"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default CartItem