import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { ProductService } from "@/services/api/ProductService"

const ProductManagement = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await ProductService.getAll()
      setProducts(data)
      setFilteredProducts(data)
    } catch (err) {
      setError("प्रोडक्ट्स लोड करने में समस्या हुई है।")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  // Filter products based on search and filters
  useEffect(() => {
    let filtered = products

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.nameHindi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter)
    }

    // Status filter
    if (statusFilter === "active") {
      filtered = filtered.filter(product => product.isActive)
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter(product => !product.isActive)
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, categoryFilter, statusFilter])

  const handleDelete = async (productId) => {
    if (!window.confirm("क्या आप वाकई इस प्रोडक्ट को डिलीट करना चाहते हैं?")) {
      return
    }

    try {
      await ProductService.delete(productId)
      setProducts(prev => prev.filter(p => p.Id !== productId))
      toast.success("प्रोडक्ट सफलतापूर्वक डिलीट हो गया!")
    } catch (error) {
      toast.error("प्रोडक्ट डिलीट करने में समस्या हुई।")
    }
  }

  const toggleProductStatus = async (product) => {
    try {
      const updatedProduct = { ...product, isActive: !product.isActive }
      await ProductService.update(product.Id, updatedProduct)
      setProducts(prev => prev.map(p => p.Id === product.Id ? updatedProduct : p))
      toast.success(`प्रोडक्ट ${updatedProduct.isActive ? "एक्टिव" : "इनएक्टिव"} कर दिया गया!`)
    } catch (error) {
      toast.error("प्रोडक्ट अपडेट करने में समस्या हुई।")
    }
  }

  const getUniqueCategories = () => {
    return [...new Set(products.map(p => p.category))].sort()
  }

  if (loading) return <Loading type="products" />
  if (error) return <Error message={error} onRetry={loadProducts} />

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-secondary-800 font-display mb-2">
            प्रोडक्ट मैनेजमेंट
          </h1>
          <p className="text-secondary-600">
            {filteredProducts.length} प्रोडक्ट्स मिले
          </p>
        </div>
        <Link to="/admin/products/add">
          <Button className="flex items-center gap-2">
            <ApperIcon name="Plus" size={20} />
            नया प्रोडक्ट जोड़ें
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-card p-6 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="प्रोडक्ट नाम खोजें..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">सभी कैटेगरी</option>
            {getUniqueCategories().map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">सभी स्टेटस</option>
            <option value="active">एक्टिव</option>
            <option value="inactive">इनएक्टिव</option>
          </Select>
          
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setCategoryFilter("")
              setStatusFilter("")
            }}
            className="flex items-center gap-2"
          >
            <ApperIcon name="RotateCcw" size={16} />
            रीसेट करें
          </Button>
        </div>
      </motion.div>

      {/* Products Grid/Table */}
      {filteredProducts.length === 0 ? (
        <Empty
          title="कोई प्रोडक्ट नहीं मिला"
          message="अपने फिल्टर बदलें या नया प्रोडक्ट जोड़ें।"
          actionLabel="प्रोडक्ट जोड़ें"
          action={() => navigate("/admin/products/add")}
          icon="Package"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-card overflow-hidden"
        >
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="text-left p-4 font-semibold text-secondary-700">प्रोडक्ट</th>
                  <th className="text-left p-4 font-semibold text-secondary-700">कैटेगरी</th>
                  <th className="text-left p-4 font-semibold text-secondary-700">कीमत</th>
                  <th className="text-left p-4 font-semibold text-secondary-700">स्टॉक</th>
                  <th className="text-left p-4 font-semibold text-secondary-700">स्टेटस</th>
                  <th className="text-left p-4 font-semibold text-secondary-700">एक्शन</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-t hover:bg-secondary-25 transition-colors duration-200"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.nameHindi || product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-secondary-800">
                            {product.nameHindi || product.name}
                          </p>
                          {product.nameHindi && product.name !== product.nameHindi && (
                            <p className="text-sm text-secondary-600">{product.name}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-secondary-600">{product.category}</td>
                    <td className="p-4 font-bold text-primary-600">
                      ₹{product.price.toLocaleString("hi-IN")}
                    </td>
                    <td className="p-4 text-secondary-600">{product.stock || "N/A"}</td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleProductStatus(product)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                          product.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {product.isActive ? "एक्टिव" : "इनएक्टिव"}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/products/edit/${product.Id}`)}
                        >
                          <ApperIcon name="Edit" size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(product.Id)}
                          className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                        >
                          <ApperIcon name="Trash2" size={14} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4 p-4">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-secondary-200 rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={product.imageUrl}
                    alt={product.nameHindi || product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-secondary-800">
                      {product.nameHindi || product.name}
                    </h3>
                    <p className="text-sm text-secondary-600">{product.category}</p>
                    <p className="text-lg font-bold text-primary-600">
                      ₹{product.price.toLocaleString("hi-IN")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleProductStatus(product)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.isActive ? "एक्टिव" : "इनएक्टिव"}
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/admin/products/edit/${product.Id}`)}
                    >
                      <ApperIcon name="Edit" size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(product.Id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ProductManagement