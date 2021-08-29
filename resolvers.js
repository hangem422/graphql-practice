const { GraphQLScalarType } = require("graphql");
const fetch = require("node-fetch");

const authorizeWithGithub = require("./helpers/github");
// const { users, photos, tags } = require("./store");

module.exports = {
  Query: {
    me(parent, args, { currentUser }) {
      return currentUser;
    },
    totalPhotos(parent, args, { db }) {
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
    async postPhoto(parent, args, { db, currentUser }) {
      if (!currentUser) {
        throw new Error("Only an authorizee user can post a photo");
      }

      const newPhoto = {
        ...args.input,
        userID: currentUser.githubLogin,
        created: new Date(),
      };

      const col = db.collection("photos");
      const { insertedIds } = await col.insert(newPhoto);
      newPhoto.id = insertedIds[0];

      return newPhoto;
    },
    async githubAuth(parent, { code }, { db }) {
      const client_id = process.env.GIT_CLIENT_ID;
      const client_secret = process.env.GIT_CLIENT_SECRET;
      const credentials = { client_id, client_secret, code };

      const {
        message,
        access_token: githubToken,
        avatar_url: avatar,
        login: githubLogin,
        name,
      } = await authorizeWithGithub(credentials);
      if (message) throw new Error(message);

      const col = db.collection("users");
      const query = { githubLogin };
      const replacement = { name, githubLogin, githubToken, avatar }; // 계정을 가지고 있다면, 깃허브에서 받아 온 정보로 계정 세부 정보를 업데이트하빈다.
      const options = { upsert: true, returnNewDocument: true }; // 계정을 아직 가지고 있지 않다면 신규 사용자로 콜렉션에 추가합니다.

      // 책에서는 collection의 replaceOne 메서드를 사용하게 돼있습니다.
      // 하지만 replaceOne 메서드는 수정된 Document를 반환하지 않습니다.
      const res = await col.findOneAndReplace(query, replacement, options);

      return { user: res.value, token: githubToken };
    },
    async addFakeUsers(parent, { count }, { db }) {
      const randomUserApi = `https://randomuser.me/api/?results=${count}`;
      const { results } = await fetch(randomUserApi).then((res) => res.json());

      const users = results.map((rand) => ({
        githubLogin: rand.login.username,
        name: `${rand.name.first} ${rand.name.last}`,
        avatar: rand.picture.thumbnail,
        githubToken: rand.login.sha1,
      }));

      const col = db.collection("users");
      await col.insert(users);

      return users;
    },
    async fakeUserAuth(parent, { githubLogin }, { db }) {
      const col = db.collection("users");
      const user = await col.findOne({ githubLogin });

      if (!user) {
        throw new Error(`Cannot find user with githubLogin ${githubLogin}`);
      }

      return {
        token: user.githubToken,
        user,
      };
    },
  },
  Photo: {
    id(parent) {
      return parent.id || parent._id;
    },
    url(parent) {
      return `/img/photos/${parent._id}.jpg`;
    },
    postedBy(parent, args, { db }) {
      const col = db.collection("users");
      return col.findOne({ githubLogin: parent.userID });
    },
    // taggedUsers(parent) {
    //   return tags
    //     .filter((tag) => tag.photoID === parent.id)
    //     .map((tag) => tag.userID)
    //     .map((userID) => users.find((user) => user.githubLogin === userID));
    // },
  },
  User: {
    postedPhotos(parent) {
      return photos.filter((p) => p.githubUser === parent.githubLogin);
    },
    // inPhotos(parent) {
    //   return tags
    //     .filter((tag) => tag.userID === parent.id)
    //     .map((tag) => tag.photoID)
    //     .map((photoID) => photos.find((photo) => photo.id === photoID));
    // },
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
