const fetch = require("node-fetch");

/**
 * @description Credentials를 전달하여 깃허브 엑세스 토큰을 요청합니다.
 * @param {{ client_id: string, client_secret: string, code: string }} credentials
 */
const requestGithubToken = (credentials) =>
  fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(credentials),
  })
    .then((res) => res.json())
    .catch((e) => {
      throw new Error(JSON.stringify(e));
    });

/**
 * @description 엑세스 토큰을 사용해 사용자 정보를 열람합니다.
 * @param {string} token
 */
const requestGithubUserAccount = (token) =>
  fetch(`https://api.github.com/user`, {
    headers: {
      Authorization: `token ${token}`,
    },
  })
    .then((res) => res.json())
    .catch((e) => {
      throw new Error(JSON.stringify(e));
    });

/**
 * @description 두 요청을 하나의 비동기 함수로 합쳐서 깃허브 사용자 권한 인증을 합니다.
 * @param {{ client_id: string, client_secret: string, code: string }} credentials
 */
async function authorizeWithGithub(credentials) {
  const { access_token } = await requestGithubToken(credentials);
  const githubUser = await requestGithubUserAccount(access_token);
  return { ...githubUser, access_token };
}

module.exports = authorizeWithGithub;
