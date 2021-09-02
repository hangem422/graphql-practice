const { request } = require("graphql-request");
require("dotenv").config();

const port = process.env.APP_PORT;
const url = `http://localhost:${port}/graphql`;

const mutation = `
mutation populate($count: Int!) {
  addFakeUsers(count: $count) {
    githubLogin
    name
  } 
}
`;

const variables = { count: 3 };

request(url, mutation, variables).then(console.log).catch(console.error);
