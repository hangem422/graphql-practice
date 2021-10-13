import React from "react";

function CurrentUser({ name, avatar, logout }) {
  return (
    <div>
      <img src={avatar} alt={name} width={48} height={48} />
      <h1>{name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default CurrentUser;
