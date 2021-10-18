import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "react-apollo";
import ApolloClient, { InMemoryCache } from "apollo-boost";
import { persistCache } from "apollo-cache-persist";
import dotenv from "dotenv";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

const cache = new InMemoryCache();
persistCache({ cache, storage: localStorage });

if (localStorage["apollo-cache-persist"]) {
  const cacheData = JSON.parse(localStorage["apollo-cache-persist"]);
  cache.restore(cacheData);
}

const client = new ApolloClient({
  cache,
  uri: "http://localhost:4000/graphql",
  request: (operation) => {
    operation.setContext((context) => ({
      headers: {
        ...context.Headers,
        authorization: localStorage.getItem("graphql-practice-token"),
      },
    }));
  },
});
dotenv.config();

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
