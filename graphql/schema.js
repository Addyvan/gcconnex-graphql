const { gql } = require('apollo-server');

const typeDefs = gql`

  type User {
    guid: ID!
    name: String!
  }

  type Query {
    user(guid: ID, name: String): User
  }

  schema {
    query: Query
  }

`;

module.exports = typeDefs;