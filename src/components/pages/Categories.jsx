import React, { useState, useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import ProductGrid from "@/components/organisms/ProductGrid"
import CategoryGrid from "@/components/organisms/CategoryGrid"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import SearchBar from "@/components/molecules/SearchBar"
import { ProductService } from "@/services/api/ProductService"

const Categories = () => {
  const { category } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [filterCategory, setFilterCategory] = useState(category || "")

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [productsData, categoriesData] = await Promise.all([
        ProductService.getAll(),
        ProductService.getCategories()
      ])
      
      let filteredProducts = productsData

      // Filter by category
      if (filterCategory) {
        filteredProducts = filteredProducts.filter(product => 
          product.category === filterCategory
        )
      }

      // Filter by search query
      if (searchQuery) {
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.nameHindi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      // Sort products
      filteredProducts.sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price
          case "price-high":
            return b.price - a.price
          case "name":
            return (a.nameHindi || a.name).localeCompare(b.nameHindi || b.name)
          default:
            return 0
        }
      })
      
      setProducts(filteredProducts)
      setCategories(categoriesData)
    } catch (err) {
      setError("प्रोडक्ट्स लोड करने में समस्या हुई है।")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [category, searchQuery, sortBy, filterCategory])

  const handleSearch = (searchTerm) => {
    if (searchTerm) {
      setSearchParams({ search: searchTerm })
    } else {
      setSearchParams({})
    }
  }

  const handleCategoryFilter = (selectedCategory) => {
    setFilterCategory(selectedCategory)
    setSearchParams({})
  }

  if (loading) return <Loading type="products" />
  if (error) return <Error message={error} onRetry={loadData} />

  const showingCategory = filterCategory || category
  const showingSearch = searchQuery

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-secondary-800 font-display mb-2">
          {showingCategory ? `${showingCategory} - प्रोडक्ट्स` : 
           showingSearch ? `"${showingSearch}" के लिए खोज परिणाम` : 
           "सभी प्रोडक्ट्स"}
        </h1>
        <p className="text-secondary-600">
          {products.length} प्रोडक्ट्स मिले
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-card p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="प्रोडक्ट नाम या कैटेगरी खोजें..."
            />
          </div>
          
          <Select
            label="क्रम से लगाएं"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">नाम से</option>
            <option value="price-low">कीमत (कम से ज्यादा)</option>
            <option value="price-high">कीमत (ज्यादा से कम)</option>
          </Select>
        </div>
        
        {/* Category Filter Buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={!filterCategory ? "primary" : "outline"}
            onClick={() => handleCategoryFilter("")}
          >
            सभी कैटेगरी
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.name}
              size="sm"
              variant={filterCategory === cat.name ? "primary" : "outline"}
              onClick={() => handleCategoryFilter(cat.name)}
            >
              {cat.name} ({cat.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Categories Grid (when no specific category is selected) */}
      {!showingCategory && !showingSearch && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-xl font-bold text-secondary-800 mb-6 font-display">
            कैटेगरी से चुनें
          </h2>
          <CategoryGrid categories={categories} />
        </motion.section>
      )}

      {/* Products Grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {products.length === 0 ? (
          <Empty
            title="कोई प्रोडक्ट नहीं मिला"
            message={
              showingSearch 
                ? `"${showingSearch}" के लिए कोई प्रोडक्ट नहीं मिला। दूसरे शब्दों से खोजें।`
                : showingCategory 
                ? `${showingCategory} कैटेगरी में अभी कोई प्रोडक्ट नहीं है।`
                : "अभी तक कोई प्रोडक्ट जोड़ा नहीं गया है।"
            }
            actionLabel="प्रोडक्ट जोड़ें"
            action={() => window.location.href = "/admin/products/add"}
            icon="Package"
          />
        ) : (
          <ProductGrid products={products} />
        )}
      </motion.section>
    </div>
  )
}

export default Categories