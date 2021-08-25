const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const fs = require("fs");

const typeDefs = fs.readFileSync("./typeDefs.graphql", "utf-8");
const resolvers = require("./resolvers");

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

// apollo-server-express version 3에서 applyMiddleware 하기 전 await server.start()를 실행하라는 버그가 있다.
// apollo-server-express@^2 다운그레이드 해서 사용하면 문제가 해결된다.
// https://github.com/nestjs/graphql/issues/1621#issuecomment-878474079
server.applyMiddleware({ app });

app.get("/", (req, res) => res.send("PhotoShare API에 오신 것을 환영합니다."));

app.listen({ port: 4000 }, () => {
  console.log(
    `GraphQL Server running @ http://localhost:4000${server.graphqlPath}`
  );
});
