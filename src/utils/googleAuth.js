/**
 * Google Identity Services (GIS) Authentication Helper for Subh Lagan Sarees
 * Using Google Client ID: 970179278240-0rrq73k6l59bono1rmo1m5jg5csh8o6c.apps.googleusercontent.com
 */

export const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '970179278240-0rrq73k6l59bono1rmo1m5jg5csh8o6c.apps.googleusercontent.com';

/**
 * Dynamically loads Google Identity Services script if not already present
 */
export const loadGoogleGsiScript = () => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.google?.accounts?.oauth2) {
      resolve(true);
      return;
    }

    const scriptId = 'google-gsi-client-script';
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    let checkInterval = setInterval(() => {
      if (window.google?.accounts?.oauth2) {
        clearInterval(checkInterval);
        resolve(true);
      }
    }, 100);

    script.onload = () => {
      clearInterval(checkInterval);
      resolve(true);
    };

    script.onerror = (err) => {
      clearInterval(checkInterval);
      reject(new Error('Failed to load Google Sign-In SDK. Please check your internet connection.'));
    };

    // Timeout after 7 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
      if (window.google?.accounts?.oauth2) {
        resolve(true);
      } else {
        reject(new Error('Google Sign-In initialization timed out.'));
      }
    }, 7000);
  });
};

/**
 * Trigger authentic Google OAuth popup and return user profile + token
 */
export const triggerGoogleAuth = async () => {
  await loadGoogleGsiScript();

  return new Promise((resolve, reject) => {
    try {
      if (!window.google?.accounts?.oauth2) {
        throw new Error('Google Identity Services not ready');
      }

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'email profile openid',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            if (tokenResponse.error === 'popup_closed_by_user') {
              reject(new Error('Google sign-in popup was closed'));
            } else {
              reject(new Error(tokenResponse.error_description || tokenResponse.error));
            }
            return;
          }

          if (tokenResponse.access_token) {
            try {
              // Fetch user profile directly from Google userinfo endpoint
              const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                  Authorization: `Bearer ${tokenResponse.access_token}`,
                },
              });

              if (userInfoRes.ok) {
                const profile = await userInfoRes.json();
                resolve({
                  token: tokenResponse.access_token,
                  profile: {
                    email: profile.email,
                    name: profile.name || `${profile.given_name || ''} ${profile.family_name || ''}`.trim(),
                    picture: profile.picture,
                    googleId: profile.sub,
                  },
                });
                return;
              }
            } catch (fetchErr) {
              console.warn('Direct Google userinfo fetch failed:', fetchErr);
            }

            // Fallback: send access_token alone to backend
            resolve({ token: tokenResponse.access_token });
          } else {
            reject(new Error('No access token received from Google'));
          }
        },
        error_callback: (error) => {
          reject(new Error(error?.message || 'Google Sign-In failed or popup was closed'));
        },
      });

      client.requestAccessToken({ prompt: 'select_account' });
    } catch (err) {
      reject(err);
    }
  });
};
