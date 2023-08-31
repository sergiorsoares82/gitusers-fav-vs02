import { GithubUser } from './GithubUser.js';

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || [];
  }

  async add(username) {
    try {
      const userAlreadyExists = this.entries.find((entry) => {
        return entry.login === username;
      });

      if (userAlreadyExists) {
        throw new Error('Usuário já cadastrado!');
      }

      const user = await GithubUser.search(username);

      if (user.login === undefined) {
        throw new Error('Não foi possível encontrar o usuário!');
      }

      this.createRow(user);
      this.entries = [user, ...this.entries];
      this.save();
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries));
  }

  delete(user) {
    const filteredUsers = this.entries.filter(
      (entry) => entry.login !== user.login
    );
    this.entries = filteredUsers;
    this.save();
    this.update();
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);
    this.tbody = this.root.querySelector('table tbody');
    this.onAdd();
    this.update();
  }

  onAdd() {
    const addButton = this.root.querySelector('.search button');
    addButton.onclick = () => {
      const input = this.root.querySelector('.search input');
      const { value } = input;
      this.add(value);
      input.value = '';
    };
  }

  update() {
    this.removeAllTr();
    this.entries.forEach((user) => this.createRow(user));
  }

  createRow(user) {
    const tr = document.createElement('tr');

    tr.innerHTML = `
            <td class="user">
              <img src="https://github.com/${user.login}.png" alt="" />
              <a href="https://github.com/${user.login}">
                <p>${user.name}</p>
                <span>/${user.name}</span>
              </a>
            </td>
            <td class="followers">${user.followers}</td>
            <td class="repositories">${user.public_repos}</td>
            <td class="remove">Remover</td>
    `;
    tr.querySelector('.remove').onclick = () => {
      const isOK = confirm('Tem certeza que deseja excluir o usuário?');
      if (isOK) {
        this.delete(user);
      }
    };
    this.tbody.append(tr);
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach((tr) => tr.remove());
  }
}
