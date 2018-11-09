const resolvers = require('./resolvers');

const typeDefs = `

type User {
  guid: ID!
  name: String
}

type Query {
  users: [User]
  user(id: ID!): User
}

`;
const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };