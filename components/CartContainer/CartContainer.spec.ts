import { mount } from '@vue/test-utils'
import { Server } from 'miragejs'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { startMirage } from '~~/mirage'
import CartContainer from './CartContainer.vue'
import CartItem from '~~/components/CartItem/CartItem.vue'

describe('CartContainer', () => {
  let server: Server

  beforeEach(() => {
    server = startMirage({ environment: 'test' })
  })

  afterEach(() => server.shutdown())

  test('should mount the component', () => {
    const wrapper = mount(CartContainer)

    expect(wrapper.vm).toBeDefined()
  })

  test('should emit close event when button gets clicked', async () => {
    const wrapper = mount(CartContainer)
    const button = wrapper.find({ ref: 'closeCartBtn' })

    await button.trigger('click')

    expect(wrapper.emitted().close).toBeTruthy()
    expect(wrapper.emitted().close).toHaveLength(1)
  })

  test('should hide the cart when no prop isOpen is not passed', async () => {
    const wrapper = mount(CartContainer)
    expect(wrapper.classes()).toContain('hidden')
  })

  test('should show the cart when no prop isOpen is passed', async () => {
    const wrapper = mount(CartContainer, {
      props: {
        isOpen: true,
      },
    })

    expect(wrapper.classes()).not.toContain('hidden')
  })

  test('should display "Cart is empty" when there are no products', () => {
    const wrapper = mount(CartContainer)

    expect(wrapper.text()).toContain('Cart is empty')
  })

  test('should display 2 instances of CartItem when 2 products are provided', async () => {
    const products = server.createList('product', 2)

    const wrapper = mount(CartContainer, {
      props: {
        products,
      },
    })

    expect(wrapper.findAllComponents(CartItem)).toHaveLength(2)
    expect(wrapper.text()).not.toContain('Cart is empty')
  })
})
