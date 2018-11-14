const { ApolloServer, gql } = require('apollo-server');

//const schema = require('./graphql/schema');

const typeDefs = gql`

  type User {
    guid: ID!
    name: String!
    language: String
    email: String
    last_action: String
    last_login: String
    colleagues: [User]
  }

  type Group {
    guid: ID!
    name: String!
    description: String
    members: [User]
  }

  type Query {
    user(guid: ID, name: String): User
    group(guid: ID, name: String): Group
  }

  schema {
    query: Query
  }

`;

const resolvers  = require('./resolvers/Query');

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
});