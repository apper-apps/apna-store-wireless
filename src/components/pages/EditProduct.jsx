import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Textarea from "@/components/atoms/Textarea"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { ProductService } from "@/services/api/ProductService"

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    nameHindi: "",
    category: "",
    price: "",
    description: "",
    imageUrl: "",
    stock: "",
    isActive: true
  })
  const [errors, setErrors] = useState({})

  const categories = [
    "ग्रोसरी",
    "इलेक्ट्रॉनिक्स",
    "कपड़े",
    "घरेलू सामान",
    "स्वास्थ्य",
    "खिलौने",
    "किताबें",
    "खेल सामान"
  ]

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError("")
      const product = await ProductService.getById(parseInt(id))
      setFormData({
        name: product.name,
        nameHindi: product.nameHindi || "",
        category: product.category,
        price: product.price.toString(),
        description: product.description,
        imageUrl: product.imageUrl,
        stock: product.stock ? product.stock.toString() : "",
        isActive: product.isActive
      })
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "प्रोडक्ट नाम जरूरी है"
    }
    
    if (!formData.nameHindi.trim()) {
      newErrors.nameHindi = "हिंदी नाम जरूरी है"
    }
    
    if (!formData.category) {
      newErrors.category = "कैटेगरी चुनना जरूरी है"
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = "सही कीमत डालें"
    }
    
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "प्रोडक्ट इमेज URL जरूरी है"
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "प्रोडक्ट विवरण जरूरी है"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("कृपया सभी जरूरी फील्ड भरें")
      return
    }

    try {
      setSaving(true)
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: formData.stock ? parseInt(formData.stock) : 0
      }

      await ProductService.update(parseInt(id), productData)
      toast.success("प्रोडक्ट सफलतापूर्वक अपडेट हो गया!")
      navigate("/admin/products")
      
    } catch (error) {
      toast.error("प्रोडक्ट अपडेट करने में समस्या हुई। फिर कोशिश करें।")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadProduct} />

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/products")}
              className="flex items-center gap-2"
            >
              <ApperIcon name="ArrowLeft" size={16} />
              वापस जाएं
            </Button>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-secondary-800 font-display">
            प्रोडक्ट एडिट करें
          </h1>
          <p className="text-secondary-600">
            प्रोडक्ट की जानकारी बदलने के लिए नीचे की डिटेल्स अपडेट करें
          </p>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h2 className="text-xl font-semibold text-secondary-800 mb-4 flex items-center gap-2">
              <ApperIcon name="Package" size={20} />
              बेसिक जानकारी
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="प्रोडक्ट नाम (English)"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                required
                placeholder="Product Name"
              />
              
              <Input
                label="प्रोडक्ट नाम (हिंदी)"
                name="nameHindi"
                value={formData.nameHindi}
                onChange={handleInputChange}
                error={errors.nameHindi}
                required
                placeholder="प्रोडक्ट का हिंदी नाम"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="कैटेगरी"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                error={errors.category}
                required
              >
                <option value="">कैटेगरी चुनें</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Select>
              
              <Input
                label="कीमत (₹)"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                error={errors.price}
                required
                placeholder="0.00"
              />
            </div>
            
            <Input
              label="स्टॉक (वैकल्पिक)"
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="उपलब्ध मात्रा"
            />
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h2 className="text-xl font-semibold text-secondary-800 mb-4 flex items-center gap-2">
              <ApperIcon name="FileText" size={20} />
              प्रोडक्ट विवरण
            </h2>
            
            <Textarea
              label="प्रोडक्ट विवरण"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              error={errors.description}
              required
              placeholder="प्रोडक्ट के बारे में विस्तार से बताएं..."
              rows={4}
            />
          </div>

          {/* Product Image */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h2 className="text-xl font-semibold text-secondary-800 mb-4 flex items-center gap-2">
              <ApperIcon name="Image" size={20} />
              प्रोडक्ट इमेज
            </h2>
            
            <Input
              label="इमेज URL"
              name="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={handleInputChange}
              error={errors.imageUrl}
              required
              placeholder="https://example.com/image.jpg"
            />
            
            {formData.imageUrl && (
              <div className="mt-4">
                <p className="text-sm font-medium text-secondary-700 mb-2">इमेज प्रीव्यू:</p>
                <div className="bg-secondary-50 rounded-lg p-4 inline-block">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = "none"
                      e.target.nextSibling.style.display = "flex"
                    }}
                  />
                  <div className="hidden w-32 h-32 bg-secondary-200 rounded-lg items-center justify-center">
                    <ApperIcon name="ImageOff" size={32} className="text-secondary-400" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Product Settings */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h2 className="text-xl font-semibold text-secondary-800 mb-4 flex items-center gap-2">
              <ApperIcon name="Settings" size={20} />
              प्रोडक्ट सेटिंग्स
            </h2>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-600 bg-secondary-100 border-secondary-300 rounded focus:ring-primary-500 focus:ring-2"
              />
              <div>
                <span className="font-medium text-secondary-800">प्रोडक्ट को एक्टिव करें</span>
                <p className="text-sm text-secondary-600">एक्टिव प्रोडक्ट्स ही स्टोर में दिखेंगे</p>
              </div>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/products")}
              disabled={saving}
            >
              रद्द करें
            </Button>
            
            <Button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  अपडेट हो रहा है...
                </>
              ) : (
                <>
                  <ApperIcon name="Save" size={16} />
                  प्रोडक्ट अपडेट करें
                </>
              )}
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  )
}

export default EditProduct