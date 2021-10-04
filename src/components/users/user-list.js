import React, { useMemo } from "react";

import UserListItem from "./user-list-item";

function UserList({ count, users, refetchUsers, addUser }) {
  const items = useMemo(() => {
    return users.map((user) => (
      <UserListItem
        key={user.githubLogin}
        name={user.name}
        avatar={user.avatar}
      />
    ));
  }, [users]);

  return (
    <div>
      <p>{count} Users</p>
      <button type="button" onClick={() => refetchUsers()}>
        다시 가져오기
      </button>
      <button type="button" onClick={() => addUser()}>
        임시 사용자 추가
      </button>
      <ul>{items}</ul>
    </div>
  );
}

export default UserList;
