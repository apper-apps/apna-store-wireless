import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { OrderService } from "@/services/api/OrderService"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await OrderService.getAll()
      setOrders(data)
    } catch (err) {
      setError("ऑर्डर्स लोड करने में समस्या हुई है।")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-secondary-100 text-secondary-800 border-secondary-200"
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "पेंडिंग"
      case "confirmed":
        return "कन्फर्म"
      case "shipped":
        return "भेजा गया"
      case "delivered":
        return "डिलीवर हुआ"
      case "cancelled":
        return "रद्द"
      default:
        return status
    }
  }

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case "cod":
        return "कैश ऑन डिलीवरी"
      case "upi":
        return "UPI"
      case "card":
        return "कार्ड"
      case "netbanking":
        return "नेट बैंकिंग"
      default:
        return method
    }
  }

  if (loading) return <Loading type="orders" />
  if (error) return <Error message={error} onRetry={loadOrders} />

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Empty
          title="कोई ऑर्डर नहीं मिला"
          message="अभी तक कोई ऑर्डर नहीं दिया गया है। शॉपिंग शुरू करें!"
          actionLabel="शॉपिंग करें"
          action={() => window.location.href = "/categories"}
          icon="Package"
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-secondary-800 font-display mb-2">
          मेरे ऑर्डर्स
        </h1>
        <p className="text-secondary-600">
          {orders.length} ऑर्डर मिले
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order, index) => (
          <motion.div
            key={order.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-card p-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <ApperIcon name="Package" size={24} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-800">
                    ऑर्डर #{order.Id}
                  </h3>
                  <p className="text-sm text-secondary-600">
                    {new Date(order.createdAt).toLocaleDateString("hi-IN")}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-secondary-700 mb-1">कस्टमर</p>
                <p className="text-secondary-800">{order.customerName}</p>
                <p className="text-sm text-secondary-600">{order.customerPhone}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-secondary-700 mb-1">डिलीवरी पता</p>
                <p className="text-sm text-secondary-800 line-clamp-2">{order.deliveryAddress}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-secondary-700 mb-1">पेमेंट</p>
                <p className="text-secondary-800">{getPaymentMethodLabel(order.paymentMethod)}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-secondary-700 mb-1">कुल राशि</p>
                <p className="text-lg font-bold text-primary-600">
                  ₹{order.totalAmount.toLocaleString("hi-IN")}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-secondary-700 mb-3">ऑर्डर आइटम:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {order.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-3 bg-secondary-50 rounded-lg p-3">
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
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Orders