<template>
  <main class="my-8">
    <SearchBar @do-search="setKeywords" />
    <div v-if="!errorMessage" class="container mx-auto px-6">
      <h3 class="text-gray-700 text-2xl font-medium">Wrist Watch</h3>
      <span class="mt-3 text-sm text-gray-500">200+ Products</span>
      <div
        class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6"
      >
        <ProductCard
          v-for="product in productList"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
    <h3 v-else class="text-center text-2xl">{{ errorMessage }}</h3>
  </main>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import axios from 'axios'
  import { Product } from '~~/entities'
  import SearchBar from '~~/components/SearchBar/SearchBar.vue'
  import ProductCard from '~~/components/ProductCard/ProductCard.vue'

  const products = ref<Product[]>([])
  const errorMessage = ref<string>('')
  const keywords = ref<string>('')

  const productList = computed<Product[]>(() => {
    if (keywords.value.trim()) {
      return products.value.filter(({ title }: Product) =>
        title.includes(keywords.value)
      )
    }
    return products.value
  })

  function setKeywords(k: string) {
    keywords.value = k
  }

  onMounted(async () => {
    try {
      const response = await axios.get('/api/products')
      products.value = response.data.products as Product[]
    } catch (error) {
      errorMessage.value = 'Problemas ao carregar a lista de produtos'
    }
  })
</script>
