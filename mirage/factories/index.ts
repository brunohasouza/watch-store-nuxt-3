import { productFactory } from './product'
import { userFactory } from './user'
export * from './user'

export const factories = {
  user: userFactory,
  product: productFactory,
}
