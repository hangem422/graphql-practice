import React, { useState, useCallback, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Mutation, useApolloClient } from "react-apollo";

import { QUERY, MUTATION } from "../../graphql";
import Me from "./me";

function AuthorizedUser({ clientID }) {
  const [signingIn, setSigningIn] = useState(false);
  const githubMutation = useRef(null);

  const apollo = useApolloClient();

  const {
    location: { pathname, search },
    replace,
  } = useHistory();

  const authCallback = useCallback(
    (_, { data }) => {
      localStorage.setItem("graphql-practice-token", data.githubAuth.token);
      setSigningIn(false);
      replace(pathname);
    },
    [pathname, replace]
  );

  const requestCode = useCallback(() => {
    window.location = `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=user`;
  }, [clientID]);

  const logout = useCallback(() => {
    localStorage.removeItem("graphql-practice-token");

    const data = apollo.readQuery({ query: QUERY.USER_QUERY });
    data.me = null;
    apollo.writeQuery({ query: QUERY.USER_QUERY, data });
  }, [apollo]);

  const mutationHoc = useCallback(
    (githubAuth) => {
      githubMutation.current = githubAuth;
      return (
        <Me signingIn={signingIn} requestCode={requestCode} logout={logout} />
      );
    },
    [signingIn, requestCode, logout]
  );

  useEffect(() => {
    const query = new URLSearchParams(search);
    if (!query.has("code")) return;

    const code = query.get("code");
    if (githubMutation.current) githubMutation.current({ variables: { code } });
    setSigningIn(true);
  }, [search]);

  return (
    <Mutation
      mutation={MUTATION.GITHUB_AUTH_MUTATION}
      update={authCallback}
      refetchQueries={[{ query: QUERY.USER_QUERY }]}
    >
      {mutationHoc}
    </Mutation>
  );
}

export default AuthorizedUser;
