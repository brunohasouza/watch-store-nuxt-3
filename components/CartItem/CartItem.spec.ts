import { mount, VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import CartItem from './CartItem.vue'
import { startMirage } from '~~/mirage'
import { Instantiate, Server } from 'miragejs'
import { faker } from '@faker-js/faker'
import { AnyRegistry } from 'miragejs/-types'
import { Product } from '~~/entities'

let server: Server
type SutTypes = {
  wrapper: VueWrapper
  product: Product
}

const makeSut = (
  title = faker.random.words(),
  price = faker.commerce.price()
): SutTypes => {
  // @ts-ignore
  const product = server.create('product', { title, price }) as Product
  const wrapper = mount(CartItem, {
    props: {
      product,
    },
  })

  return {
    product,
    wrapper,
  }
}

describe('CartItem', () => {
  beforeEach(() => {
    server = startMirage({ environment: 'test' })
  })

  afterEach(() => server.shutdown())

  test('should mount the component', () => {
    const { wrapper } = makeSut()

    expect(wrapper.vm).toBeDefined()
  })

  test('should display product info', () => {
    const { wrapper, product } = makeSut()

    expect(wrapper.text()).toContain(product.title)
    expect(wrapper.text()).toContain(product.price)
  })

  test('should display quantity 1 when product is first displayed', () => {
    const { wrapper } = makeSut()
    const quantity = wrapper.find({ ref: 'productQuantity' })

    expect(quantity.text()).toBe('1')
  })

  test('should increase quantity when + button gets clicked', async () => {
    const { wrapper } = makeSut()
    const button = wrapper.find({ ref: 'increaseBtn' })
    const quantity = wrapper.find({ ref: 'productQuantity' })

    await button.trigger('click')
    expect(quantity.text()).toBe('2')

    await button.trigger('click')
    expect(quantity.text()).toBe('3')

    await button.trigger('click')
    expect(quantity.text()).toBe('4')
  })

  test('should decrease quantity when - button gets clicked', async () => {
    const { wrapper } = makeSut()
    const button = wrapper.find({ ref: 'decreaseBtn' })
    const quantity = wrapper.find({ ref: 'productQuantity' })

    await button.trigger('click')
    expect(quantity.text()).toBe('0')
  })

  test('should not go below zero when button - is repeatedly clicked', async () => {
    const { wrapper } = makeSut()
    const button = wrapper.find({ ref: 'decreaseBtn' })
    const quantity = wrapper.find({ ref: 'productQuantity' })

    await button.trigger('click')
    await button.trigger('click')
    await button.trigger('click')

    expect(quantity.text()).toBe('0')
  })
})
