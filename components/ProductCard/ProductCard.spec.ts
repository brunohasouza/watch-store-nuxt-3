import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import ProductCard from './ProductCard.vue'
import { startMirage } from '~~/mirage'
import { Server } from 'miragejs'
import { AnyRegistry, Instantiate } from 'miragejs/-types'

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
  })

  afterEach(() => server.shutdown())

  test('Should mount the component', () => {
    const { wrapper } = makeSut()
    expect(wrapper.vm).toBeDefined()
  })

  test('should emit the event addToCart with product object', async () => {
    const { wrapper, product } = makeSut()

    await wrapper.find('button').trigger('click')

    const addToCart = wrapper.emitted().addToCart

    expect(addToCart).toBeTruthy()
    expect(addToCart.length).toBe(1)
    expect(addToCart[0]).toEqual([product])
  })
})
