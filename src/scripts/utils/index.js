// import App from '../pages/app';

export function showFormattedDate(date, locale = 'en-US', options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function convertBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function isServiceWorkerAvailable() {
  return 'serviceWorker' in navigator;
}
 
export async function registerServiceWorker() {
  if (!isServiceWorkerAvailable()) {
    console.log('Service Worker API unsupported');
    return;
  }
 
  try {
    console.log('Attempting to register service worker...');
    const registration = await navigator.serviceWorker.register('./sw.bundle.js', {
      scope: './'
    });
    console.log('Service worker registration successful:', registration);
    
    // Check if push manager is available
    if (registration.pushManager) {
      console.log('Push Manager is available');
      const subscription = await registration.pushManager.getSubscription();
      console.log('Current push subscription:', subscription);
    } else {
      console.log('Push Manager is NOT available');
    }

    // Check service worker state
    if (registration.active) {
      console.log('Service worker is active');
    } else if (registration.installing) {
      console.log('Service worker is installing');
    } else if (registration.waiting) {
      console.log('Service worker is waiting');
    }
  } catch (error) {
    console.error('Failed to install service worker:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  }
}