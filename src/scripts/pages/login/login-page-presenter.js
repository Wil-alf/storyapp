import LoginPageView from './login-page-view';
import { login } from '../../data/api';

class LoginPagePresenter {
  constructor({ view, navigate }) {
    this._view = view;
    this._navigate = navigate;
  }

  async init() {
    this._view.render();
    this._view.bindLoginHandler(this._handleLogin.bind(this));
  }

  async _handleLogin({ email, password }) {
    try {
      const loginResult = await login(email, password);
      localStorage.setItem('token', loginResult.loginResult.token);
      localStorage.setItem('name', loginResult.loginResult.name);
      this._navigate('#/');
    } catch (error) {
      this._view.showError(error.message);
    }
  }
}

export default LoginPagePresenter;
