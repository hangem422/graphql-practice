import { ApolloServer } from "apollo-server-express";
import { MongoClient } from "mongodb";
import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import resolvers from "./resolvers.js";

dotenv.config();
const __dirname = path.resolve();

const typeDefs = fs.readFileSync(
  __dirname + "/server/typeDefs.graphql",
  "utf-8"
);
const html = fs.readFileSync(__dirname + "/build/index.html", {
  encoding: "utf8",
});

async function start(port) {
  const app = express();

  const MONGO_DB = process.env.DB_HOST;
  const client = await MongoClient.connect(MONGO_DB, { useNewUrlParser: true });
  const db = client.db();

  const context = async ({ req }) => {
    const githubToken = req.headers.authorization;
    const currentUser = await db.collection("users").findOne({ githubToken });
    return { db, currentUser };
  };

  const server = new ApolloServer({ typeDefs, resolvers, context });

  // apollo-server-express version 3에서 applyMiddleware 하기 전 await server.start()를 실행하라는 버그가 있다.
  // apollo-server-express@^2 다운그레이드 해서 사용하면 문제가 해결된다.
  // https://github.com/nestjs/graphql/issues/1621#issuecomment-878474079
  server.applyMiddleware({ app });

  app.use((req, res, next) => {
    if (req.path === "/") res.status(200).send(html);
    else next();
  });

  app.use(express.static(__dirname + "/build"));

  app.listen({ port }, () => {
    const msg = `GraphQL Server running @ http://localhost:${port}${server.graphqlPath}`;
    console.log(msg);
  });
}

const PORT = process.env.APP_PORT;
start(PORT);
