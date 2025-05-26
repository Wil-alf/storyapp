import LoginPagePresenter from './login-page-presenter';
import LoginPageView from './login-page-view';

class LoginPage {
  async render() {
    return '<section id="login-container"></section>';
  }

  async afterRender() {
    const view = new LoginPageView('login-container');
    const presenter = new LoginPagePresenter({
      view,
      navigate: (url) => window.location.hash = url,
    });
    await presenter.init();
  }
}

export default LoginPage;
