import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Empty = ({ 
  title = "कोई आइटम नहीं मिला",
  message = "यहाँ अभी तक कुछ भी नहीं है।",
  action,
  actionLabel = "शुरू करें",
  icon = "Package"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-gradient-to-br from-secondary-100 to-secondary-200 p-8 rounded-full mb-6">
        <ApperIcon 
          name={icon} 
          size={64} 
          className="text-secondary-400" 
        />
      </div>
      <h3 className="text-xl font-semibold text-secondary-800 mb-2">
        {title}
      </h3>
      <p className="text-secondary-600 mb-6 max-w-md">
        {message}
      </p>
      {action && actionLabel && (
        <Button 
          onClick={action}
          variant="primary"
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={16} />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default Empty