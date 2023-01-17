import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import ProductList from './index.vue'
import ProductCard from '~~/components/ProductCard/ProductCard.vue'
import SearchBar from '~~/components/SearchBar/SearchBar.vue'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
  SpyInstance,
} from 'vitest'
import { startMirage } from '~~/mirage'
import axios from 'axios'
import { Server } from 'miragejs'

let server: Server

const makeSut = (): VueWrapper => {
  return mount(ProductList)
}

describe('ProductList - integration', () => {
  let axiosGet: SpyInstance

  beforeEach(() => {
    server = startMirage({ environment: 'test' })
    axiosGet = vi.spyOn(axios, 'get')
  })

  afterEach(() => {
    server.shutdown()
  })

  test('should mount the component', () => {
    const wrapper = makeSut()

    expect(wrapper.vm).toBeDefined()
  })

  test('should mount the SearchBar component as a child', () => {
    const wrapper = makeSut()
    expect(wrapper.findComponent(SearchBar)).toBeDefined()
  })

  test('should call axios.get on component mount', () => {
    const axiosGet = vi.spyOn(axios, 'get')
    makeSut()

    expect(axiosGet).toHaveBeenCalledTimes(1)
    expect(axiosGet).toHaveBeenCalledWith('/api/products')
  })

  test('should mount the ProductCard component 10 times', async () => {
    const products = server.createList('product', 10)

    axiosGet.mockReturnValueOnce({ data: { products } })

    const wrapper = makeSut()

    await flushPromises()

    const cards = wrapper.findAllComponents(ProductCard)
    expect(cards).toHaveLength(10)
  })

  test('should display the error message when Promise rejects', async () => {
    axiosGet.mockRejectedValueOnce(new Error(''))

    const wrapper = makeSut()

    await flushPromises()

    expect(wrapper.text()).toContain(
      'Problemas ao carregar a lista de produtos'
    )
  })

  test('should filter the product list when a search is performed', async () => {
    const products = [
      ...server.createList('product', 10),
      server.create('product', {
        //@ts-ignore
        title: 'Meu relógio amado',
      }),
      server.create('product', {
        //@ts-ignore
        title: 'Meu relógio amado 2',
      }),
    ]

    axiosGet.mockResolvedValueOnce({ data: { products } })

    const wrapper = makeSut()

    await flushPromises()

    const searchElement = wrapper.findComponent(SearchBar)

    searchElement.find('input[type="search"]').setValue('relógio')
    await searchElement.find('form').trigger('submit')

    const cards = wrapper.findAllComponents(ProductCard)

    //@ts-ignore
    expect(wrapper.vm.keywords).toEqual('relógio')
    expect(cards).toHaveLength(2)
  })
})
