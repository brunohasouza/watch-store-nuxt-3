import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Product } from '~~/entities'

export const useCartStore = defineStore('cart', () => {
  const open = ref(false)
  const items = ref<Product[]>([])

  const hasProducts = computed<boolean>(() => items.value.length > 0)

  function productIsInTheCart(item: Product) {
    return !!items.value.find((product) => product.id === item.id)
  }

  function toggleCart() {
    open.value = !open.value
  }

  function addItem(item: Product) {
    if (!productIsInTheCart(item)) {
      items.value.push(item)
    }
  }

  function removeItem(item: Product) {
    items.value = [...items.value.filter((product) => product.id !== item.id)]
  }

  function openCart() {
    open.value = true
  }

  function closeCart() {
    open.value = false
  }

  function clearProducts() {
    items.value = []
  }

  function clearCart() {
    clearProducts()
    closeCart()
  }

  return {
    open,
    items,
    toggleCart,
    openCart,
    addItem,
    removeItem,
    closeCart,
    productIsInTheCart,
    clearProducts,
    clearCart,
    hasProducts,
  }
})
