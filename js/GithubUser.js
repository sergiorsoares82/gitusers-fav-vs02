export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`;
    return fetch(endpoint)
      .then((data) => {
        return data.json();
      })
      .then(({ name, login, followers, public_repos }) => {
        return { name, login, followers, public_repos };
      });
  }
}
