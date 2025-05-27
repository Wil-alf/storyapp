import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import {generateSubscribeButtonTemplate,   generateUnsubscribeButtonTemplate,} from '../templates';
import {isServiceWorkerAvailable,} from '../utils';
import {isCurrentPushSubscriptionAvailable, subscribe, unsubscribe } from '../utils/notification-helper';
class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      })
    });
  }

  async #setupPushNotification() {
    console.log('Setting up push notification...');
    const pushNotificationTools = document.getElementById('push-notification-tools');
    console.log('Push notification tools element found:', !!pushNotificationTools);
    
    try {
      const isSubscribed = await isCurrentPushSubscriptionAvailable();
      console.log('Current subscription status:', isSubscribed);

      if (isSubscribed) {
        console.log('User is subscribed, showing unsubscribe button');
        pushNotificationTools.innerHTML = generateUnsubscribeButtonTemplate();
        document.getElementById('unsubscribe-button').addEventListener('click', () => {
          unsubscribe().finally(() => {
            this.#setupPushNotification();
          });
        });
        return;
      }
    
      if (!pushNotificationTools) {
        console.warn('Element #push-notification-tools not found.');
        return;
      }

      console.log('User is not subscribed, showing subscribe button');
      pushNotificationTools.innerHTML = generateSubscribeButtonTemplate();

      const subscribeButton = document.getElementById('subscribe-button');
      console.log('Subscribe button found:', !!subscribeButton);
      
      if (subscribeButton) {
        subscribeButton.addEventListener('click', () => {
          console.log('Subscribe button clicked');
          subscribe().finally(() => {
            this.#setupPushNotification();
          });
        });
      }
    } catch (error) {
      console.error('Error in setupPushNotification:', error);
    }
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];
  
    this.#content.classList.add('fade-exit');
    this.#content.classList.add('fade-exit-active');

    await new Promise(resolve => setTimeout(resolve, 300));
    this.#content.innerHTML = '';
  
    const newContent = await page.render();
    this.#content.innerHTML = newContent;
  
    await page.afterRender();
  
    this.#content.classList.add('fade-enter');
    requestAnimationFrame(() => {
      this.#content.classList.add('fade-enter-active');
    });
  
    setTimeout(() => {
      this.#content.classList.remove('fade-exit', 'fade-exit-active', 'fade-enter', 'fade-enter-active');
    }, 300);

    if (isServiceWorkerAvailable()) {
      this.#setupPushNotification();
    }
  }
  
}

export default App;
