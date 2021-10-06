import React, { useState, useCallback, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Mutation } from "react-apollo";

import { QUERY, MUTATION } from "../../graphql";
import GithubLoginBtn from "./github-login-btn";

function AuthorizedUser({ clientID }) {
  const [signingIn, setSigningIn] = useState(false);
  const githubMutation = useRef(null);

  const {
    location: { pathname, search },
    replace,
  } = useHistory();

  const mutationHoc = useCallback(
    (githubAuth) => {
      githubMutation.current = githubAuth;
      return <GithubLoginBtn clientID={clientID} disabled={signingIn} />;
    },
    [clientID, signingIn]
  );

  const authCallback = useCallback(
    (_, { data }) => {
      console.log(data);
      localStorage.setItem("graphql-practice-token", data.githubAuth.token);
      setSigningIn(false);
      replace(pathname);
    },
    [pathname, replace]
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
      refetchQueries={QUERY.USER_QUERY}
    >
      {mutationHoc}
    </Mutation>
  );
}

export default AuthorizedUser;
