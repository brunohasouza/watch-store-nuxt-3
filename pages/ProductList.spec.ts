import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import axios from 'axios'
import { faker } from '@faker-js/faker'
import { createPinia, setActivePinia } from 'pinia'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
  SpyInstance,
} from 'vitest'
import { Instantiate, Server } from 'miragejs'
import { AnyRegistry } from 'miragejs/-types'
import ProductList from './index.vue'
import ProductCard from '~~/components/ProductCard/ProductCard.vue'
import SearchBar from '~~/components/SearchBar/SearchBar.vue'
import { startMirage } from '~~/mirage'

let server: Server

type SutType = {
  products: Instantiate<AnyRegistry, 'product'>[]
  wrapper: VueWrapper
  axiosGet: SpyInstance
}

const mountSut = async (reject = false): Promise<SutType> => {
  const axiosGet = vi.spyOn(axios, 'get')
  const products = [
    ...server.createList('product', 10),
    server.create('product', {
      // @ts-ignore
      title: 'Meu relógio amado',
    }),
  ]

  if (reject) {
    axiosGet.mockRejectedValueOnce(new Error(faker.random.words()))
  } else {
    axiosGet.mockResolvedValueOnce({ data: { products } })
  }

  const wrapper = mount(ProductList)

  await flushPromises()

  return {
    products,
    wrapper,
    axiosGet,
  }
}

describe('ProductList - integration', () => {
  beforeEach(() => {
    server = startMirage({ environment: 'test' })
    setActivePinia(createPinia())
  })

  afterEach(() => {
    server.shutdown()
  })

  test('should mount the component', async () => {
    const { wrapper } = await mountSut()

    expect(wrapper.vm).toBeDefined()
  })

  test('should mount the SearchBar component as a child', async () => {
    const { wrapper } = await mountSut()
    expect(wrapper.findComponent(SearchBar)).toBeDefined()
  })

  test('should call axios.get on component mount', async () => {
    const { axiosGet } = await mountSut()

    expect(axiosGet).toHaveBeenCalledTimes(1)
    expect(axiosGet).toHaveBeenCalledWith('/api/products')
  })

  test('should mount the ProductCard component 11 times', async () => {
    const { wrapper } = await mountSut()

    const cards = wrapper.findAllComponents(ProductCard)
    expect(cards).toHaveLength(11)
  })

  test('should display the error message when Promise rejects', async () => {
    const { wrapper } = await mountSut(true)

    expect(wrapper.text()).toContain(
      'Problemas ao carregar a lista de produtos'
    )
  })

  test('should filter the product list when a search is performed', async () => {
    const { wrapper } = await mountSut()

    const searchElement = wrapper.findComponent(SearchBar)

    searchElement.find('input[type="search"]').setValue('relógio')
    await searchElement.find('form').trigger('submit')

    const cards = wrapper.findAllComponents(ProductCard)

    // @ts-ignore
    expect(wrapper.vm.keywords).toEqual('relógio')
    expect(cards).toHaveLength(1)
  })

  test('should show all products when doSearch is empty', async () => {
    const { wrapper } = await mountSut()

    const searchElement = wrapper.findComponent(SearchBar)

    searchElement.find('input[type="search"]').setValue('relógio')
    await searchElement.find('form').trigger('submit')

    searchElement.find('input[type="search"]').setValue('')
    await searchElement.find('form').trigger('submit')

    const cards = wrapper.findAllComponents(ProductCard)

    // @ts-ignore
    expect(wrapper.vm.keywords).toEqual('')
    expect(cards).toHaveLength(11)
  })
})
