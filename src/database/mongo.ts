import { error } from 'console';
import { MongoClient, Db, ObjectId } from 'mongodb';

const url = process.env.MONGO_URL

if (!url) {
  console.error("Require MONGO_URL")
  process.exit(1)
}

const dbName = 'blog';

let db: Db;

export const connectToDatabase = async (): Promise<void> => {
  const client = new MongoClient(url);
  await client.connect();
  db = client.db(dbName);
};

export const getPosts = async () => {
  const collection = db.collection('posts');
  return collection.find().toArray();
};

export const getPostById = async (id: string) => {
  const collection = db.collection('posts');
  return collection.findOne({ _id: new ObjectId(id) });
};

export const createPost = async (title: string, content: string, image: string, author: string) => {
  const postCollection = db.collection('posts');
  const authorCollection = db.collection('authors');
  // const authorId = new ObjectId(author)
  let authorObject = await authorCollection.findOne<Author>({ name: author })

  // if new author
  if (!authorObject) {
    const res = await authorCollection.insertOne({ name: author, posts: [] });
    const insertedAuthorId = res.insertedId;
    authorObject = await authorCollection.findOne<Author>({ _id: insertedAuthorId });
  }
  if (!authorObject) {
    return null;
  }

  //else exist author
  const result = await postCollection.insertOne({ title, content, image, author: authorObject._id });
  const insertedPostId = result.insertedId;
  const insertedPost = await postCollection.findOne({ _id: insertedPostId });

  authorObject.posts.push(insertedPostId.toString());
  const authorId = new ObjectId(authorObject._id)
  await authorCollection.findOneAndUpdate({ _id: authorId },
    {
      $set: {
        posts: authorObject.posts
      },
    })

  return insertedPost;
};

export const findAuthor = async (id: string) => {
  const collection = db.collection('authors');
  const objId = new ObjectId(id)
  const result = await collection.findOne({ _id: objId })
  return result;
}

export const createAuthor = async (name: string) => {
  const collection = db.collection('authors');
  const result = await collection.insertOne({ name, posts: [] });
  const insertedId = result.insertedId;
  const insertedAuthor = await collection.findOne({ _id: insertedId });
  return insertedAuthor;
};