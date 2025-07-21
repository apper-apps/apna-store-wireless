import React from "react"

const Loading = ({ type = "products" }) => {
  const ProductSkeleton = () => (
    <div className="bg-white rounded-xl shadow-card p-4 animate-pulse">
      <div className="bg-secondary-200 h-48 rounded-lg mb-4"></div>
      <div className="space-y-3">
        <div className="bg-secondary-200 h-4 rounded w-3/4"></div>
        <div className="bg-secondary-200 h-3 rounded w-1/2"></div>
        <div className="bg-secondary-200 h-6 rounded w-1/3"></div>
      </div>
    </div>
  )

  const OrderSkeleton = () => (
    <div className="bg-white rounded-xl shadow-card p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <div className="bg-secondary-200 h-4 rounded w-32"></div>
          <div className="bg-secondary-200 h-3 rounded w-24"></div>
        </div>
        <div className="bg-secondary-200 h-6 rounded w-16"></div>
      </div>
      <div className="space-y-2">
        <div className="bg-secondary-200 h-3 rounded w-3/4"></div>
        <div className="bg-secondary-200 h-3 rounded w-1/2"></div>
      </div>
    </div>
  )

  const StatsSkeleton = () => (
    <div className="bg-white rounded-xl shadow-card p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="bg-secondary-200 h-3 rounded w-20"></div>
          <div className="bg-secondary-200 h-8 rounded w-16"></div>
        </div>
        <div className="bg-secondary-200 h-10 w-10 rounded-full"></div>
      </div>
    </div>
  )

  if (type === "products") {
    return (
      <div className="product-grid">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (type === "orders") {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <OrderSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (type === "stats") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatsSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
    </div>
  )
}

export default Loading