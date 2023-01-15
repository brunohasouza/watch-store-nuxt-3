import { Server } from 'miragejs'

export const productSeeder = (server: Server) => {
  server.createList('product', 25)
}
