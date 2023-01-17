import { mount, VueWrapper } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import SearchBar from './SearchBar.vue'

const makeSut = (): VueWrapper => {
  return mount(SearchBar)
}

describe('SearchBar', () => {
  test('should mount the component', () => {
    const wrapper = makeSut()
    expect(wrapper.vm).toBeDefined()
  })

  test('should emit search event when form is submitted', async () => {
    const wrapper = makeSut()
    const keywords = 'teste'

    await wrapper.find('input[type="search"]').setValue(keywords)
    await wrapper.find('form').trigger('submit')

    const doSearch = wrapper.emitted().doSearch

    expect(doSearch).toBeTruthy()
    expect(doSearch.length).toBe(1)
    expect(doSearch[0]).toEqual([keywords])
  })

  test('should emit search event when search input is cleared', async () => {
    const wrapper = makeSut()
    const keywords = 'teste'
    const input = wrapper.find('input[type="search"]')

    await input.setValue(keywords)
    await input.setValue('')

    const doSearch = wrapper.emitted().doSearch

    expect(doSearch).toBeTruthy()
    expect(doSearch.length).toBe(1)
    expect(doSearch[0]).toEqual([''])
  })
})
