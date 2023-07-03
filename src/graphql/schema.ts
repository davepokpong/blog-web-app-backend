import { gql } from 'apollo-server';

const typeDefs = gql`
  type Post {
    _id: ID!
    title: String!
    content: String!
    image: String
    author: String!
  }

  type Author {
    _id: ID!
    name: String!
    posts: [ID!]!
  }

  type Query {
    posts: [Post!]!
    post(_id: ID!): Post
    author(_id: ID!): Author
  }

  type Mutation {
    createPost(title: String!, content: String!, image: String, author: String!): Post!
    createAuthor(name: String!): Author!
  }
`;

export default typeDefs;
