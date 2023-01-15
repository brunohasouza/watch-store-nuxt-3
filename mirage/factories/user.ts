import { Factory } from 'miragejs'
import { faker } from '@faker-js/faker'
import { User } from '~~/entities'

export const userFactory = Factory.extend<User>({
  id(i) {
    return `${i}`
  },

  name() {
    return faker.name.fullName()
  },

  mobile() {
    return faker.phone.number()
  },
})
