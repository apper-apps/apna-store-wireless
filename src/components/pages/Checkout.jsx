import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Textarea from "@/components/atoms/Textarea"
import { useCart } from "@/hooks/useCart"
import { OrderService } from "@/services/api/OrderService"

const Checkout = () => {
  const navigate = useNavigate()
  const { items, getTotalAmount, clearCart } = useCart()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "cod"
  })
  
  const [errors, setErrors] = useState({})

  const totalAmount = getTotalAmount()

  // Redirect if cart is empty
  if (items.length === 0) {
    navigate("/cart")
    return null
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = "नाम जरूरी है"
    }
    
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = "फोन नंबर जरूरी है"
    } else if (!/^[0-9]{10}$/.test(formData.customerPhone.replace(/\D/g, ""))) {
      newErrors.customerPhone = "सही फोन नंबर डालें"
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "पूरा पता जरूरी है"
    }
    
    if (!formData.city.trim()) {
      newErrors.city = "शहर का नाम जरूरी है"
    }
    
    if (!formData.pincode.trim()) {
      newErrors.pincode = "पिन कोड जरूरी है"
    } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = "सही पिन कोड डालें"
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
      setLoading(true)
      
      const orderData = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        email: formData.email,
        deliveryAddress: `${formData.address}, ${formData.city}, ${formData.pincode}`,
        items: items,
        totalAmount: totalAmount,
        paymentMethod: formData.paymentMethod,
        status: "pending"
      }

      const order = await OrderService.create(orderData)
      
      // Clear cart and redirect
      clearCart()
      toast.success("ऑर्डर सफलतापूर्वक दिया गया!")
      navigate(`/orders`, { state: { newOrder: order } })
      
    } catch (error) {
      toast.error("ऑर्डर देने में समस्या हुई। फिर कोशिश करें।")
    } finally {
      setLoading(false)
    }
  }

  const paymentMethods = [
    { value: "cod", label: "कैश ऑन डिलीवरी (COD)", icon: "Banknote" },
    { value: "upi", label: "UPI (PhonePe, GPay, Paytm)", icon: "Smartphone" },
    { value: "card", label: "डेबिट/क्रेडिट कार्ड", icon: "CreditCard" },
    { value: "netbanking", label: "नेट बैंकिंग", icon: "Building2" }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-secondary-800 font-display mb-8">
          चेकआउट
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-card p-6"
              >
                <h2 className="text-xl font-semibold text-secondary-800 mb-4 flex items-center gap-2">
                  <ApperIcon name="User" size={20} />
                  व्यक्तिगत जानकारी
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="पूरा नाम"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    error={errors.customerName}
                    required
                    placeholder="आपका पूरा नाम"
                  />
                  <Input
                    label="फोन नंबर"
                    name="customerPhone"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    error={errors.customerPhone}
                    required
                    placeholder="10 अंकों का फोन नंबर"
                  />
                </div>
                
                <Input
                  label="ईमेल (वैकल्पिक)"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="आपका ईमेल पता"
                />
              </motion.div>

              {/* Delivery Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-card p-6"
              >
                <h2 className="text-xl font-semibold text-secondary-800 mb-4 flex items-center gap-2">
                  <ApperIcon name="MapPin" size={20} />
                  डिलीवरी पता
                </h2>
                
                <div className="space-y-4">
                  <Textarea
                    label="पूरा पता"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    error={errors.address}
                    required
                    placeholder="मकान नंबर, गली, इलाका"
                    rows={3}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="शहर"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      error={errors.city}
                      required
                      placeholder="आपका शहर"
                    />
                    <Input
                      label="पिन कोड"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      error={errors.pincode}
                      required
                      placeholder="6 अंकों का पिन कोड"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-card p-6"
              >
                <h2 className="text-xl font-semibold text-secondary-800 mb-4 flex items-center gap-2">
                  <ApperIcon name="CreditCard" size={20} />
                  पेमेंट का तरीका
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.value}
                      className={`
                        cursor-pointer p-4 rounded-lg border-2 transition-all duration-200
                        ${formData.paymentMethod === method.value 
                          ? "border-primary-500 bg-primary-50" 
                          : "border-secondary-200 hover:border-primary-300"
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={formData.paymentMethod === method.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3">
                        <ApperIcon 
                          name={method.icon} 
                          size={20} 
                          className={
                            formData.paymentMethod === method.value 
                              ? "text-primary-600" 
                              : "text-secondary-400"
                          }
                        />
                        <span className="font-medium text-secondary-800">
                          {method.label}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </motion.div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-card p-6 sticky top-24"
            >
              <h2 className="text-xl font-bold text-secondary-800 mb-4 font-display">
                ऑर्डर सारांश
              </h2>
              
              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.nameHindi || item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-secondary-800 line-clamp-1">
                        {item.nameHindi || item.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-secondary-600">
                          मात्रा: {item.quantity}
                        </span>
                        <span className="font-semibold text-primary-600">
                          ₹{(item.price * item.quantity).toLocaleString("hi-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-secondary-600">सबटोटल:</span>
                  <span className="font-semibold">₹{totalAmount.toLocaleString("hi-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">डिलीवरी:</span>
                  <span className="text-green-600 font-semibold">मुफ्त</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-secondary-800 pt-2 border-t">
                  <span>कुल राशि:</span>
                  <span className="text-primary-600">₹{totalAmount.toLocaleString("hi-IN")}</span>
                </div>
              </div>
              
              <Button
                type="submit"
                size="lg"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-6 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    प्रोसेसिंग...
                  </>
                ) : (
                  <>
                    <ApperIcon name="ShieldCheck" size={20} />
                    ऑर्डर कन्फर्म करें
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout