import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Error = ({ 
  message = "कुछ गलत हुआ है। कृपया फिर से कोशिश करें।", 
  onRetry,
  showRetry = true 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-full mb-6">
        <ApperIcon 
          name="AlertTriangle" 
          size={48} 
          className="text-red-500" 
        />
      </div>
      <h3 className="text-xl font-semibold text-secondary-800 mb-2">
        ओह! कुछ समस्या है
      </h3>
      <p className="text-secondary-600 mb-6 max-w-md">
        {message}
      </p>
      {showRetry && onRetry && (
        <Button 
          onClick={onRetry}
          variant="primary"
          className="flex items-center gap-2"
        >
          <ApperIcon name="RotateCcw" size={16} />
          फिर से कोशिश करें
        </Button>
      )}
    </div>
  )
}

export default Error