<template>
  <div class="flex justify-between mt-6">
    <div class="flex">
      <img
        :src="product.image"
        :alt="product.title"
        class="h-20 w-20 object-cover rounded"
      />
      <div class="mx-3">
        <h3 class="text-sm text-gray-600">{{ product.title }}</h3>
        <div class="flex items-center mt-2">
          <button
            class="text-gray-500 focus:outline-none focus:text-gray-600"
            ref="decreaseBtn"
            :disabled="quantity <= 0"
            @click="decreaseQuantity"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </button>
          <span class="text-gray-700 mx-2" ref="productQuantity">{{
            quantity
          }}</span>
          <button
            class="text-gray-500 focus:outline-none focus:text-gray-600"
            ref="increaseBtn"
            @click="increaseQuantity"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <span class="text-gray-600">${{ product.price }}</span>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { Product } from '~~/entities'

  type Props = {
    product: Product
  }

  defineProps<Props>()

  const quantity = ref(1)

  function increaseQuantity() {
    quantity.value += 1
  }

  function decreaseQuantity() {
    if (quantity.value > 0) {
      quantity.value -= 1
    }
  }
</script>
