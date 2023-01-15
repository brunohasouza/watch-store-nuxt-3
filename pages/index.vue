<template>
  <main class="my-8">
    <div v-if="!errorMessage" class="container mx-auto px-6">
      <h3 class="text-gray-700 text-2xl font-medium">Wrist Watch</h3>
      <span class="mt-3 text-sm text-gray-500">200+ Products</span>
      <div
        class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6"
      >
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
    <h3 v-else class="text-center text-2xl">{{ errorMessage }}</h3>
  </main>
</template>

<script setup lang="ts">
  import axios from 'axios'
  import { Product } from '~~/entities'
  import ProductCard from '~~/components/ProductCard/ProductCard.vue'

  const products = ref<Product[]>([])
  const errorMessage = ref<string>('')

  onMounted(async () => {
    try {
      const response = await axios.get('/api/products')
      products.value = response.data.products as Product[]
    } catch (error) {
      errorMessage.value = 'Problemas ao carregar produtos'
    }
  })
</script>
