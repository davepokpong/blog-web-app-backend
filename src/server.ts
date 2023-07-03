import { config } from 'dotenv';
config()

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';
import { connectToDatabase } from './database/mongo';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
});


async function main() {
  await server.start()

  server.applyMiddleware({ app });

  connectToDatabase()
    .then(() => {
      app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
      });
    })
    .catch((error) => {
      console.error('Failed to connect to the database:', error);
    });

}
main()