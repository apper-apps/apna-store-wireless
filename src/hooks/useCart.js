import { useState, useEffect } from "react"

export const useCart = () => {
  const [items, setItems] = useState([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("rl-apna-store-cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
        localStorage.removeItem("rl-apna-store-cart")
      }
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("rl-apna-store-cart", JSON.stringify(items))
  }, [items])

  const addToCart = (product) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product.productId)
      
      if (existingItem) {
        return prevItems.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        )
      } else {
        return [...prevItems, product]
      }
    })
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
      return
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const removeFromCart = (productId) => {
    setItems(prevItems => prevItems.filter(item => item.productId !== productId))
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalAmount = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const isInCart = (productId) => {
    return items.some(item => item.productId === productId)
  }

  const getItemQuantity = (productId) => {
    const item = items.find(item => item.productId === productId)
    return item ? item.quantity : 0
  }

  return {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalAmount,
    getTotalItems,
    isInCart,
    getItemQuantity
  }
}