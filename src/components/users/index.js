import React, { useCallback } from "react";
import { Query, Mutation } from "react-apollo";

import { QUERY, MUTATION } from "../../graphql";
import UserList from "./user-list";

function Users() {
  const updateCache = useCallback((cache, { data: { addFakeUsers } }) => {
    const data = cache.readQuery({ query: QUERY.USER_QUERY });
    data.totalUsers += addFakeUsers.length;
    data.allUsers = data.allUsers.concat(addFakeUsers);
    cache.writeQuery({ query: QUERY.USER_QUERY });
  }, []);

  const mutationHoc = useCallback(
    (data, refetch) => (addFakeUsers) =>
      (
        <UserList
          count={data.totalUsers}
          users={data.allUsers}
          refetchUsers={refetch}
          addUser={addFakeUsers}
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
          update={updateCache}
        >
          {mutationHoc(data, refetch)}
        </Mutation>
      );
    },
    [mutationHoc, updateCache]
  );

  return <Query query={QUERY.USER_QUERY}>{queryCallback}</Query>;
}

export default Users;
