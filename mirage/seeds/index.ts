import { Server } from 'miragejs'
import { productSeeder } from './product'
import { userSeeder } from './user'

export const seeds = (server: Server) => {
  userSeeder(server)
  productSeeder(server)
}
