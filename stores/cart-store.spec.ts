import { createPinia, setActivePinia, Store } from 'pinia'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { Server } from 'miragejs'
import { useCartStore } from './cart-store'
import { startMirage } from '~~/mirage'
import { Product } from '~~/entities'
import { faker } from '@faker-js/faker'

const makeProduct = (): Product =>
  new Product(
    faker.datatype.uuid(),
    faker.random.words(),
    faker.commerce.price(),
    faker.image.city()
  )

describe('Cart Store', () => {
  let server: Server

  beforeEach(() => {
    server = startMirage({ environment: 'test' })
    setActivePinia(createPinia())
  })

  afterEach(() => server.shutdown())

  test('should set cart to open', () => {
    const cartStore = useCartStore()
    cartStore.openCart()

    expect(cartStore.open).toBe(true)
  })

  test('should set cart to closed', () => {
    const cartStore = useCartStore()
    cartStore.openCart()
    cartStore.closeCart()

    expect(cartStore.open).toBe(false)
  })

  test('should add product to the cart only once', () => {
    const cartStore = useCartStore()
    const product = makeProduct()

    cartStore.addItem(product)
    cartStore.addItem(product)

    expect(cartStore.items).toHaveLength(1)
  })

  test('should remove product from the cart', () => {
    const cartStore = useCartStore()
    const product = makeProduct()

    cartStore.addItem(product)
    cartStore.removeItem(product)

    expect(cartStore.items).toHaveLength(0)
  })

  test('should clear products', () => {
    const cartStore = useCartStore()
    const p1 = makeProduct()
    const p2 = makeProduct()

    cartStore.addItem(p1)
    cartStore.addItem(p2)

    cartStore.clearProducts()

    expect(cartStore.items).toHaveLength(0)
  })

  test('should clear cart', () => {
    const cartStore = useCartStore()
    const p1 = makeProduct()
    const p2 = makeProduct()

    cartStore.openCart()
    cartStore.addItem(p1)
    cartStore.addItem(p2)

    cartStore.clearCart()

    expect(cartStore.items).toHaveLength(0)
    expect(cartStore.open).toBeFalsy()
  })

  test('should switch open value between true and false when toggleCart is called', () => {
    const cartStore = useCartStore()

    cartStore.toggleCart()
    expect(cartStore.open).toBeTruthy()

    cartStore.toggleCart()
    expect(cartStore.open).toBeFalsy()
  })

  test('should return true if cart is not empty', () => {
    const cartStore = useCartStore()
    const p1 = makeProduct()
    const p2 = makeProduct()

    cartStore.addItem(p1)
    cartStore.addItem(p2)

    expect(cartStore.hasProducts).toBeTruthy()
  })

  test('should return true if product is already in the cart', () => {
    const cartStore = useCartStore()
    const product = makeProduct()

    cartStore.addItem(product)

    expect(cartStore.productIsInTheCart(product)).toBeTruthy()
  })
})
