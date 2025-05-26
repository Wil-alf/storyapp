class LoginPageView {
  constructor(containerId = 'login-container') {
    this.container = document.getElementById(containerId);
  }

  render() {
    this.container.innerHTML = `
      <form id="login-form" class="login-form">
        <h2>Login</h2>
        <label for="email">Email</label>
        <input type="email" id="email" required>
        <label for="password">Password</label>
        <input type="password" id="password" required>
        <button type="submit">Login</button>
        <p id="login-error" style="color: red; display: none;"></p>
      </form>
    `;
  }

  bindLoginHandler(handler) {
    this.container.querySelector('#login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = this.container.querySelector('#email').value;
      const password = this.container.querySelector('#password').value;
      await handler({ email, password });
    });
  }

  showError(message) {
    const errorElem = this.container.querySelector('#login-error');
    errorElem.textContent = message;
    errorElem.style.display = 'block';
  }
}

export default LoginPageView;
