import React from "react";

function UserListItem({ name, avatar }) {
  return (
    <li>
      <img src={avatar} width={40} height={48} alt="avatar" />
      {name}
    </li>
  );
}

export default UserListItem;
