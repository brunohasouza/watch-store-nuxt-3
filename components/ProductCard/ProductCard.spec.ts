import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { Server } from 'miragejs'
import { AnyRegistry, Instantiate } from 'miragejs/-types'
import { createPinia, setActivePinia } from 'pinia'
import { startMirage } from '~~/mirage'
import { useCartStore } from '~~/stores'
import ProductCard from './ProductCard.vue'

let server: Server

type SutTypes = {
  product: Instantiate<AnyRegistry, 'product'>
  wrapper: VueWrapper
}

const makeSut = (): SutTypes => {
  const product = server.create('product')
  const wrapper = mount(ProductCard, {
    props: {
      product,
    },
  })

  return { product, wrapper }
}

describe('ProductCard', () => {
  beforeEach(() => {
    server = startMirage({ environment: 'test' })
    setActivePinia(createPinia())
  })

  afterEach(() => server.shutdown())

  test('Should mount the component', () => {
    const { wrapper } = makeSut()
    expect(wrapper.vm).toBeDefined()
  })

  test('should add item to cartState on button click', async () => {
    const { wrapper } = makeSut()
    const cartStore = useCartStore()
    await wrapper.find('button').trigger('click')

    expect(cartStore.items).toHaveLength(1)
  })

  test.todo('should ensure product is not added to the cart twice')
})
