const { ApolloServer } = require("apollo-server");
const { users, photos, tags } = require("./store");

const typeDefs = `
  enum PhotoCategory {
    SELFIE
    PROTRAIT
    ACTION
    LANDSCAPE
    GRAPHIC
  }

  type User {
    githubLogin: ID!
    name: String
    avatar: String
    postedPhotos: [Photo!]!
    inPhotos: [Photo!]!
  }

  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
    category: PhotoCategory!
    postedBy: User!
    taggedUsers: [User!]!
  }

  input PostPhotoInput {
    name: String!
    category: PhotoCategory = PROTRAIT
    description: String
  }

  type Query {
    totalPhotos: Int!
    allPhotos: [Photo!]!
  }

  type Mutation {
    postPhoto(input: PostPhotoInput!): Photo!
  }
`;

let _id = photos.length;

const resolvers = {
  Query: {
    totalPhotos() {
      return photos.length;
    },
    allPhotos() {
      return photos;
    },
  },
  Mutation: {
    postPhoto(parent, args) {
      const newPhoto = { id: _id++, ...args.input };
      photos.push(newPhoto);
      return newPhoto;
    },
  },
  Photo: {
    url(parent) {
      return `http://yoursite.com/img/${parent.id}.jpg`;
    },
    postedBy(parent) {
      return users.find((p) => p.githubLogin === parent.githubUser);
    },
    taggedUsers(parent) {
      return tags
        .filter((tag) => tag.photoID === parent.id)
        .map((tag) => tag.userID)
        .map((userID) => users.find((user) => user.githubLogin === userID));
    },
  },
  User: {
    postedPhotos(parent) {
      return photos.filter((p) => p.githubUser === parent.githubLogin);
    },
    inPhotos(parent) {
      return tags
        .filter((tag) => tag.userID === parent.id)
        .map((tag) => tag.photoID)
        .map((photoID) => photos.find((photo) => photo.id === photoID));
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen()
  .then(({ url }) => console.log(`GraphQL Service running on ${url}`));
