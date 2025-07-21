import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import ProductCard from "@/components/molecules/ProductCard"

const ProductGrid = ({ products }) => {
  return (
    <div className="product-grid">
      <AnimatePresence>
        {products.map((product, index) => (
          <motion.div
            key={product.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default ProductGrid