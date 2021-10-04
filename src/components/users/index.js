import React, { useCallback } from "react";
import { gql } from "apollo-boost";
import { Query, Mutation } from "react-apollo";

import UserList from "./user-list";

const USER_QUERY = gql`
  query allUsers {
    totalUsers
    allUsers {
      githubLogin
      name
      avatar
    }
  }
`;

const ADD_FAKE_USERS_MUTATION = gql`
  mutation addFakeUsers($count: Int!) {
    addFakeUsers(count: $count) {
      githubLogin
      name
      avatar
    }
  }
`;

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
      console.log(loading);
      if (loading) return <p>사용자 불러오는 중...</p>;
      return (
        <Mutation
          mutation={ADD_FAKE_USERS_MUTATION}
          variables={{ count: 1 }}
          refetchQueries={[{ query: USER_QUERY }]}
        >
          {mutationHoc(data, refetch)}
        </Mutation>
      );
    },
    [mutationHoc]
  );

  return <Query query={USER_QUERY}>{queryCallback}</Query>;
}

export default Users;
