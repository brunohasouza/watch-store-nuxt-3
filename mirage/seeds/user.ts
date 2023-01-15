import { Server } from 'miragejs'

export const userSeeder = (server: Server) => {
  server.createList('user', 10)
}
