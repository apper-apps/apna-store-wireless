import React from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"

const CategoryCard = ({ category, icon, count, gradient }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/categories/${encodeURIComponent(category)}`)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={`
        relative cursor-pointer rounded-xl p-6 text-center text-white overflow-hidden
        bg-gradient-to-br ${gradient} shadow-lg hover:shadow-xl transition-all duration-300
      `}
    >
      <div className="relative z-10">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
          <ApperIcon name={icon} size={32} className="text-white" />
        </div>
        <h3 className="font-semibold text-lg mb-1">{category}</h3>
        <p className="text-sm opacity-90">{count} आइटम</p>
      </div>
      
      {/* Decorative background pattern */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-6 -translate-x-6"></div>
    </motion.div>
  )
}

export default CategoryCard