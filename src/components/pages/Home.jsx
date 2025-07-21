import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import ProductGrid from "@/components/organisms/ProductGrid"
import CategoryGrid from "@/components/organisms/CategoryGrid"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { ProductService } from "@/services/api/ProductService"

const Home = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [productsData, categoriesData] = await Promise.all([
        ProductService.getFeatured(),
        ProductService.getCategories()
      ])
      
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (err) {
      setError("डेटा लोड करने में समस्या हुई है।")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) return <Loading type="products" />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl overflow-hidden text-white"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 p-8 md:p-12">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 font-display">
              स्वागत है <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                RL Apna Store
              </span> में
            </h1>
            <p className="text-xl mb-8 opacity-90">
              हर जरूरत का सामान, एक ही जगह। आसान खरीदारी, घर तक डिलीवरी।
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" })}
              >
                <ApperIcon name="Grid3X3" size={20} />
                कैटेगरी देखें
              </Button>
              <Link to="/admin/products/add">
                <Button size="lg" variant="accent">
                  <ApperIcon name="Plus" size={20} />
                  प्रोडक्ट जोड़ें
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 translate-x-24"></div>
      </motion.section>

      {/* Categories Section */}
      <section id="categories" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-secondary-800 font-display">
              कैटेगरी
            </h2>
            <p className="text-secondary-600">
              अपनी पसंदीदा कैटेगरी चुनें
            </p>
          </div>
          <Link to="/categories">
            <Button variant="outline" size="sm">
              सभी देखें
              <ApperIcon name="ArrowRight" size={16} />
            </Button>
          </Link>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CategoryGrid categories={categories} />
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-secondary-800 font-display">
              खास प्रोडक्ट्स
            </h2>
            <p className="text-secondary-600">
              आज के लिए चुने गए बेहतरीन प्रोडक्ट्स
            </p>
          </div>
          <Link to="/categories">
            <Button variant="outline" size="sm">
              और देखें
              <ApperIcon name="ArrowRight" size={16} />
            </Button>
          </Link>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ProductGrid products={products} />
        </motion.div>
      </section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-accent-500 to-accent-700 rounded-2xl p-8 md:p-12 text-white text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          अपना स्टोर शुरू करें
        </h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          आसान इंटरफेस के साथ अपने प्रोडक्ट्स ऑनलाइन बेचना शुरू करें।
          सब कुछ एक ही जगह पर!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/admin/products/add">
            <Button size="lg" variant="secondary">
              <ApperIcon name="Plus" size={20} />
              पहला प्रोडक्ट जोड़ें
            </Button>
          </Link>
          <Link to="/admin">
            <Button size="lg" variant="ghost" className="text-white hover:bg-white/20">
              <ApperIcon name="BarChart3" size={20} />
              डैशबोर्ड देखें
            </Button>
          </Link>
        </div>
      </motion.section>
    </div>
  )
}

export default Home