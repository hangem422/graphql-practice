import React, { useCallback } from "react";

function GithubLoginBtn({ clientID, disabled }) {
  const requestCode = useCallback(() => {
    window.location = `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=user`;
  }, [clientID]);

  return (
    <button type="button" onClick={requestCode} disabled={disabled}>
      깃허브로 로그인
    </button>
  );
}

export default GithubLoginBtn;
