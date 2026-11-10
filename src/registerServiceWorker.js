// Service Worker Registration for Subh Lagan PWA

export function registerServiceWorker() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          // Check for worker updates
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) return;
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('Subh Lagan PWA: New content available, will update on reload.');
                } else {
                  console.log('Subh Lagan PWA: Content is cached for offline use.');
                }
              }
            };
          };
        })
        .catch((error) => {
          console.warn('Subh Lagan PWA registration error:', error);
        });
    });
  }
}

