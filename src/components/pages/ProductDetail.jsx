import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { ProductService } from "@/services/api/ProductService"
import { useCart } from "@/hooks/useCart"

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [quantity, setQuantity] = useState(1)

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await ProductService.getById(parseInt(id))
      setProduct(data)
    } catch (err) {
      setError("प्रोडक्ट लोड करने में समस्या हुई है।")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      loadProduct()
    }
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    
    addToCart({
      productId: product.Id,
      name: product.name,
      nameHindi: product.nameHindi,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: quantity
    })
    
    toast.success(`${quantity} ${product.nameHindi || product.name} कार्ट में जोड़ा गया!`)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate("/cart")
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadProduct} />
  if (!product) return <Error message="प्रोडक्ट नहीं मिला।" />

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <div className="flex items-center gap-2 text-sm text-secondary-600">
          <button onClick={() => navigate("/")} className="hover:text-primary-600">
            होम
          </button>
          <ApperIcon name="ChevronRight" size={16} />
          <button 
            onClick={() => navigate(`/categories/${product.category}`)}
            className="hover:text-primary-600"
          >
            {product.category}
          </button>
          <ApperIcon name="ChevronRight" size={16} />
          <span className="text-secondary-800 font-medium">
            {product.nameHindi || product.name}
          </span>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.nameHindi || product.name}
              className="w-full h-96 md:h-[500px] object-cover"
            />
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium inline-block mb-3">
              {product.category}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-secondary-800 font-display mb-2">
              {product.nameHindi || product.name}
            </h1>
            {product.nameHindi && product.name !== product.nameHindi && (
              <p className="text-lg text-secondary-600 mb-4">{product.name}</p>
            )}
          </div>

          {/* Price */}
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-xl">
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-primary-600 font-display">
                ₹{product.price.toLocaleString("hi-IN")}
              </span>
              {product.stock && (
                <div className="text-sm text-secondary-600">
                  <span className="font-medium">स्टॉक:</span> {product.stock} उपलब्ध
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-secondary-800 mb-3">
                प्रोडक्ट विवरण
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                  मात्रा
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 p-0 rounded-full"
                  >
                    <ApperIcon name="Minus" size={16} />
                  </Button>
                  <span className="text-xl font-semibold text-secondary-800 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 p-0 rounded-full"
                  >
                    <ApperIcon name="Plus" size={16} />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!product.isActive}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <ApperIcon name="ShoppingCart" size={20} />
                  कार्ट में जोड़ें
                </Button>
                <Button
                  size="lg"
                  variant="accent"
                  onClick={handleBuyNow}
                  disabled={!product.isActive}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <ApperIcon name="Zap" size={20} />
                  अभी खरीदें
                </Button>
              </div>

              {!product.isActive && (
                <p className="text-red-600 text-center font-medium">
                  यह प्रोडक्ट अभी उपलब्ध नहीं है
                </p>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-secondary-800 mb-4">
              खरीदारी की सुविधाएं
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <ApperIcon name="Truck" size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-secondary-800">तेज़ डिलीवरी</p>
                  <p className="text-sm text-secondary-600">2-3 दिन में</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <ApperIcon name="Shield" size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-secondary-800">सुरक्षित पेमेंट</p>
                  <p className="text-sm text-secondary-600">सभी तरीके उपलब्ध</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <ApperIcon name="RotateCcw" size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-secondary-800">आसान रिटर्न</p>
                  <p className="text-sm text-secondary-600">7 दिन की गारंटी</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <ApperIcon name="Headphones" size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-secondary-800">24/7 सपोर्ट</p>
                  <p className="text-sm text-secondary-600">हमेशा आपकी सेवा में</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProductDetail