import React, { useCallback } from "react";
import { Query } from "react-apollo";

import { QUERY } from "../../graphql";
import CurrentUser from "./current-user";

function Me({ logout, requestCode, signingIn }) {
  const queryCallback = useCallback(
    ({ loading, data }) => {
      if (data && data.me) {
        const { name, avatar } = data.me;
        return <CurrentUser name={name} avatar={avatar} logout={logout} />;
      }

      if (loading) {
        return <p>Loading ...</p>;
      }

      return (
        <button type="button" onClick={requestCode} disabled={signingIn}>
          Sign In with Github
        </button>
      );
    },
    [requestCode, signingIn, logout]
  );

  return <Query query={QUERY.USER_QUERY}>{queryCallback}</Query>;
}

export default Me;
