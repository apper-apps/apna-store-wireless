import React from "react"
import CategoryCard from "@/components/molecules/CategoryCard"

const CategoryGrid = ({ categories }) => {
  const categoryConfig = {
    "ग्रोसरी": { icon: "Apple", gradient: "from-green-500 to-green-600" },
    "इलेक्ट्रॉनिक्स": { icon: "Laptop", gradient: "from-blue-500 to-blue-600" },
    "कपड़े": { icon: "Shirt", gradient: "from-purple-500 to-purple-600" },
    "घरेलू सामान": { icon: "Home", gradient: "from-orange-500 to-orange-600" },
    "स्वास्थ्य": { icon: "Heart", gradient: "from-red-500 to-red-600" },
    "खिलौने": { icon: "GameController", gradient: "from-pink-500 to-pink-600" },
    "किताबें": { icon: "Book", gradient: "from-indigo-500 to-indigo-600" },
    "खेल सामान": { icon: "Zap", gradient: "from-yellow-500 to-yellow-600" }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category) => {
        const config = categoryConfig[category.name] || { 
          icon: "Package", 
          gradient: "from-secondary-500 to-secondary-600" 
        }
        
        return (
          <CategoryCard
            key={category.name}
            category={category.name}
            count={category.count}
            icon={config.icon}
            gradient={config.gradient}
          />
        )
      })}
    </div>
  )
}

export default CategoryGrid