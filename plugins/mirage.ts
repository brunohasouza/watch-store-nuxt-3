import { startMirage } from '~~/mirage'

export default defineNuxtPlugin(() => {
  if (process.env.NODE_ENV === 'development') {
    startMirage()
  }
})
