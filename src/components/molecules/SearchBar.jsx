import React, { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Input from "@/components/atoms/Input"
import { cn } from "@/utils/cn"

const SearchBar = ({ onSearch, placeholder = "प्रोडक्ट खोजें...", className }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch?.(searchTerm)
  }

  const handleChange = (e) => {
    setSearchTerm(e.target.value)
    if (e.target.value === "") {
      onSearch?.("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative flex-1 max-w-2xl", className)}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" 
        />
        <Input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholder}
          className="pl-10 pr-4 py-3 w-full border-2 border-secondary-200 focus:border-primary-500 rounded-full bg-white"
        />
      </div>
    </form>
  )
}

export default SearchBar