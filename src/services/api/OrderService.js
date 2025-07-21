let ordersData = []

class OrderService {
  static async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  static async getAll() {
    await this.delay()
    return [...ordersData]
  }

  static async getById(id) {
    await this.delay()
    const order = ordersData.find(o => o.Id === id)
    if (!order) {
      throw new Error("Order not found")
    }
    return { ...order }
  }

  static async getByStatus(status) {
    await this.delay()
    return ordersData
      .filter(o => o.status === status)
      .map(o => ({ ...o }))
  }

  static async create(orderData) {
    await this.delay()
    
    // Find the highest ID and increment
    const maxId = Math.max(...ordersData.map(o => o.Id), 0)
    const newOrder = {
      Id: maxId + 1,
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    ordersData.push(newOrder)
    return { ...newOrder }
  }

  static async update(id, orderData) {
    await this.delay()
    
    const index = ordersData.findIndex(o => o.Id === id)
    if (index === -1) {
      throw new Error("Order not found")
    }
    
    ordersData[index] = {
      ...ordersData[index],
      ...orderData,
      Id: id,
      updatedAt: new Date().toISOString()
    }
    
    return { ...ordersData[index] }
  }

  static async delete(id) {
    await this.delay()
    
    const index = ordersData.findIndex(o => o.Id === id)
    if (index === -1) {
      throw new Error("Order not found")
    }
    
    const deletedOrder = { ...ordersData[index] }
    ordersData.splice(index, 1)
    return deletedOrder
  }

  static async updateStatus(id, status) {
    await this.delay()
    
    return this.update(id, { status })
  }

  static async getRecent(limit = 10) {
    await this.delay()
    
    return ordersData
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit)
      .map(o => ({ ...o }))
  }
}

export { OrderService }