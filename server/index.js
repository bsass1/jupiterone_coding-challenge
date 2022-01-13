const { ApolloServer, gql } = require('apollo-server')
const { RESTDataSource } = require('apollo-datasource-rest')

class breachedAccountDataAPI extends RESTDataSource {

  async willSendRequest(request) {
    await request.headers.set('hibp-api-key','11a561d02d894b5ba7239d6d1500e73a');
  }
  async getBreachedAccount( emailAddress) {
    const data = await this.get(  `https://haveibeenpwned.com/api/v3/breachedaccount/${emailAddress}`)
    return data
  }
}

const schema = gql(` 
  type BreachedAccount { 
  Name: String
  } 
  type Query {
    breachedAccountByEmailAddress(emailAddress: String):  [BreachedAccount]
  }
`)

// create the resolvers
const resolvers = {
  Query: {
    breachedAccountByEmailAddress: async (parent, args, context, info) => {
      return await context.dataSources.breachedAccountDataAPI.getBreachedAccount(args.emailAddress)
    }
  }
}

const dbConnection = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(db)
    }, 2000)
  })
}

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  dataSources: () => {
    return {
      breachedAccountDataAPI:  new breachedAccountDataAPI()
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})


