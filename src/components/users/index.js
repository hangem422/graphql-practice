import React, { useCallback } from "react";
import { Query, Mutation } from "react-apollo";

import { QUERY, MUTATION } from "../../graphql";
import UserList from "./user-list";

function Users() {
  const mutationHoc = useCallback(
    (data, refetch) => (addFakeUser) =>
      (
        <UserList
          count={data.totalUsers}
          users={data.allUsers}
          refetchUsers={refetch}
          addUser={addFakeUser}
        />
      ),
    []
  );

  const queryCallback = useCallback(
    ({ data, loading, refetch }) => {
      if (loading) return <p>사용자 불러오는 중...</p>;
      return (
        <Mutation
          mutation={MUTATION.ADD_FAKE_USERS_MUTATION}
          variables={{ count: 1 }}
          refetchQueries={[{ query: QUERY.USER_QUERY }]}
        >
          {mutationHoc(data, refetch)}
        </Mutation>
      );
    },
    [mutationHoc]
  );

  return <Query query={QUERY.USER_QUERY}>{queryCallback}</Query>;
}

export default Users;
