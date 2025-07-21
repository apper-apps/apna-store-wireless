import React from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { useCart } from "@/hooks/useCart"

const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const handleProductClick = () => {
    navigate(`/product/${product.Id}`)
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart({
      productId: product.Id,
      name: product.name,
      nameHindi: product.nameHindi,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1
    })
    toast.success(`${product.nameHindi || product.name} कार्ट में जोड़ा गया!`)
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden cursor-pointer group"
      onClick={handleProductClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.nameHindi || product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {!product.isActive && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            स्टॉक खत्म
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-secondary-800 mb-1 line-clamp-2">
          {product.nameHindi || product.name}
        </h3>
        <p className="text-sm text-secondary-600 mb-2 line-clamp-1">
          {product.category}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary-600 font-display">
              ₹{product.price.toLocaleString("hi-IN")}
            </span>
            {product.stock && (
              <span className="text-xs text-secondary-500">
                स्टॉक: {product.stock}
              </span>
            )}
          </div>
          
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={!product.isActive}
            className="flex items-center gap-1 text-sm"
          >
            <ApperIcon name="ShoppingCart" size={14} />
            जोड़ें
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard