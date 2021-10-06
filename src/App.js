import React from "react";

import Users from "./components/users";
import AuthorizedUser from "./components/authorized-user";

function App() {
  return (
    <div className="App">
      <AuthorizedUser clientID={process.env.REACT_APP_GIT_CLIENT_ID} />
      <Users />
    </div>
  );
}

export default App;
