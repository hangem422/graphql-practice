const { GraphQLScalarType } = require("graphql");
const { users, photos, tags } = require("./store");

let _id = photos.length;

module.exports = {
  Query: {
    totalPhotos(parent, args, { db }) {
      console.log("??");
      const col = db.collection("photos");
      return col.estimatedDocumentCount();
    },
    totalUsers(parent, args, { db }) {
      const col = db.collection("users");
      return col.estimatedDocumentCount();
    },
    allPhotos(parent, args, { db }) {
      const col = db.collection("photos");
      return col.find().toArray();
    },
    allUsers(parent, args, { db }) {
      const col = db.collection("users");
      return col.find().toArray();
    },
  },
  Mutation: {
    postPhoto(parent, args) {
      const newPhoto = { id: _id++, created: new Date(), ...args.input };
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
  DateTime: new GraphQLScalarType({
    name: "DateTime",
    description: "A valild date time value",
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return new Date(value).toISOString();
    },
    parseLiteral(ast) {
      return ast.value;
    },
  }),
};
