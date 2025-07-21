import productsData from "../mockData/products.json"

class ProductService {
  static async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  static async getAll() {
    await this.delay()
    return [...productsData]
  }

  static async getById(id) {
    await this.delay()
    const product = productsData.find(p => p.Id === id)
    if (!product) {
      throw new Error("Product not found")
    }
    return { ...product }
  }

  static async getFeatured(limit = 8) {
    await this.delay()
    const activeProducts = productsData.filter(p => p.isActive)
    return activeProducts.slice(0, limit).map(p => ({ ...p }))
  }

  static async getByCategory(category) {
    await this.delay()
    return productsData
      .filter(p => p.category === category && p.isActive)
      .map(p => ({ ...p }))
  }

  static async getCategories() {
    await this.delay()
    const categoryMap = new Map()
    
    productsData.forEach(product => {
      if (product.isActive) {
        const count = categoryMap.get(product.category) || 0
        categoryMap.set(product.category, count + 1)
      }
    })
    
    return Array.from(categoryMap.entries()).map(([name, count]) => ({
      name,
      count
    }))
  }

  static async create(productData) {
    await this.delay()
    
    // Find the highest ID and increment
    const maxId = Math.max(...productsData.map(p => p.Id), 0)
    const newProduct = {
      Id: maxId + 1,
      ...productData,
      createdAt: new Date().toISOString()
    }
    
    productsData.push(newProduct)
    return { ...newProduct }
  }

  static async update(id, productData) {
    await this.delay()
    
    const index = productsData.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error("Product not found")
    }
    
    productsData[index] = {
      ...productsData[index],
      ...productData,
      Id: id,
      updatedAt: new Date().toISOString()
    }
    
    return { ...productsData[index] }
  }

  static async delete(id) {
    await this.delay()
    
    const index = productsData.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error("Product not found")
    }
    
    const deletedProduct = { ...productsData[index] }
    productsData.splice(index, 1)
    return deletedProduct
  }

  static async search(query) {
    await this.delay()
    
    const lowerQuery = query.toLowerCase()
    return productsData
      .filter(p => 
        p.isActive && (
          p.name.toLowerCase().includes(lowerQuery) ||
          p.nameHindi?.toLowerCase().includes(lowerQuery) ||
          p.description?.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery)
        )
      )
      .map(p => ({ ...p }))
  }
}

export { ProductService }