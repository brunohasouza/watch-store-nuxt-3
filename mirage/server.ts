import { Server, createServer } from 'miragejs'

import { models } from './models'
import { factories } from './factories'
import { seeds } from './seeds'
import { routes } from './routes'

const config = (environment: string) => ({
  environment,
  factories,
  models,
  seeds,
  routes,
})

export function startMirage({ environment = 'development' } = {}): Server {
  return createServer(config(environment))
}

// export function startMirage(environment = 'development') {
//   const server = createServer({
//     environment,
//     models,
//     factories,
//     seeds(server) {
//       server.createList('user', 10),
//       server.createList('product', 25)
//     },
//     routes() {
//       this.namespace = 'api'
//       this.get('/users', (schema: AppSchema) => {
//         return schema.all('user')
//       })

//       this.get('/products', (schema: AppSchema) => {
//         return schema.all('product')
//       })
//     }
//   })

//   return server

//   for(const namespace in endpoints) {
//     //@ts-ignore
//     endpoints[namespace](server)
//   }

//   server.namespace = 'api'

//   server.logging = true

//   console.log(server)
// }
