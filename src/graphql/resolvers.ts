import { getPosts, getPostById, createPost, createAuthor, findAuthor } from '../database/mongo';

// posts: [Post!]!
// post(_id: ID!): Post

const resolvers = {
  Query: {
    posts: () => {
      return getPosts();
    },
    post: (_: any, { _id }: PostParams) => {
      return getPostById(_id);
    },
    author: (_: any, { _id }: PostParams) => {
      return findAuthor(_id);
    },
  },
  Mutation: {
    createPost: (_: any, { title, content, image, author }: CreatePostParams) => {
      return createPost(title, content, image, author);
    },
    createAuthor: (_: any, { name }: CreateAuthorParams) => {
      return createAuthor(name);
    },
  },
};

export default resolvers;
