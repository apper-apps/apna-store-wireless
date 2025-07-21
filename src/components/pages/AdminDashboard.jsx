import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { ProductService } from "@/services/api/ProductService"
import { OrderService } from "@/services/api/OrderService"

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    categories: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [products, orders, categories] = await Promise.all([
        ProductService.getAll(),
        OrderService.getAll(),
        ProductService.getCategories()
      ])

      // Calculate stats
      const totalProducts = products.length
      const activeProducts = products.filter(p => p.isActive).length
      const totalOrders = orders.length
      const pendingOrders = orders.filter(o => o.status === "pending").length
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
      
      setStats({
        totalProducts,
        activeProducts,
        totalOrders,
        pendingOrders,
        totalRevenue,
        categories: categories.length
      })

      // Get recent orders (last 5)
      const sortedOrders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setRecentOrders(sortedOrders.slice(0, 5))
      
    } catch (err) {
      setError("डैशबोर्ड डेटा लोड करने में समस्या हुई है।")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-secondary-100 text-secondary-800"
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

  if (loading) return <Loading type="stats" />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  const statCards = [
    {
      title: "कुल प्रोडक्ट्स",
      value: stats.totalProducts,
      icon: "Package",
      gradient: "from-blue-500 to-blue-600",
      description: `${stats.activeProducts} एक्टिव`
    },
    {
      title: "कुल ऑर्डर्स",
      value: stats.totalOrders,
      icon: "ShoppingBag",
      gradient: "from-green-500 to-green-600",
      description: `${stats.pendingOrders} पेंडिंग`
    },
    {
      title: "कुल सेल्स",
      value: `₹${stats.totalRevenue.toLocaleString("hi-IN")}`,
      icon: "TrendingUp",
      gradient: "from-primary-500 to-primary-600",
      description: "अब तक की कमाई"
    },
    {
      title: "कैटेगरी",
      value: stats.categories,
      icon: "Grid3X3",
      gradient: "from-purple-500 to-purple-600",
      description: "अलग-अलग कैटेगरी"
    }
  ]

  const quickActions = [
    {
      title: "नया प्रोडक्ट जोड़ें",
      description: "अपने स्टोर में नया आइटम जोड़ें",
      icon: "Plus",
      link: "/admin/products/add",
      color: "from-green-500 to-green-600"
    },
    {
      title: "प्रोडक्ट्स मैनेज करें",
      description: "अपने प्रोडक्ट्स देखें और एडिट करें",
      icon: "Settings",
      link: "/admin/products",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "सभी ऑर्डर्स देखें",
      description: "ऑर्डर्स की पूरी लिस्ट देखें",
      icon: "List",
      link: "/orders",
      color: "from-purple-500 to-purple-600"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent font-display mb-2">
          एडमिन डैशबोर्ड
        </h1>
        <p className="text-secondary-600 text-lg">
          अपने स्टोर की पूरी जानकारी एक जगह देखें
        </p>
      </div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${stat.gradient} text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <ApperIcon name={stat.icon} size={24} />
              </div>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm opacity-75">{stat.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-secondary-800 font-display">
          त्वरित कार्य
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link key={action.title} to={action.link}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`bg-gradient-to-br ${action.color} text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <ApperIcon name={action.icon} size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{action.title}</h3>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <ApperIcon name="ArrowRight" size={20} className="opacity-75" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* Recent Orders */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-secondary-800 font-display">
            हाल के ऑर्डर्स
          </h2>
          <Link to="/orders">
            <Button variant="outline" size="sm">
              सभी देखें
              <ApperIcon name="ArrowRight" size={16} />
            </Button>
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-secondary-700">ऑर्डर ID</th>
                    <th className="text-left p-4 font-semibold text-secondary-700">कस्टमर</th>
                    <th className="text-left p-4 font-semibold text-secondary-700">राशि</th>
                    <th className="text-left p-4 font-semibold text-secondary-700">स्टेटस</th>
                    <th className="text-left p-4 font-semibold text-secondary-700">तारीख</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <motion.tr
                      key={order.Id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-t hover:bg-secondary-25 transition-colors duration-200"
                    >
                      <td className="p-4 font-medium text-secondary-800">#{order.Id}</td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-secondary-800">{order.customerName}</p>
                          <p className="text-sm text-secondary-600">{order.customerPhone}</p>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-primary-600">
                        ₹{order.totalAmount.toLocaleString("hi-IN")}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="p-4 text-secondary-600">
                        {new Date(order.createdAt).toLocaleDateString("hi-IN")}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-card p-8 text-center">
            <ApperIcon name="Package" size={48} className="text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-600">अभी तक कोई ऑर्डर नहीं आया है</p>
          </div>
        )}
      </motion.section>
    </div>
  )
}

export default AdminDashboard