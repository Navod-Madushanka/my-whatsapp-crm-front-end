import { useEffect, useState } from 'react';

/**
 * Production-ready hook to load the Meta JS SDK.
 * Compliant with React 18+ concurrency and strict mode.
 */
export const useMetaSDK = () => {
  // We initialize the state by checking the window object directly.
  // This avoids calling setState(true) inside useEffect if the SDK is already present.
  const [isLoaded, setIsLoaded] = useState(() => typeof window !== 'undefined' && !!window.FB);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. If the SDK is already loaded, we have nothing to do.
    if (window.FB) return;

    // 2. Define the callback that Meta will call once the script loads and executes.
    // This is the "Subscription" pattern recommended by React.
    window.fbAsyncInit = () => {
      try {
        window.FB.init({
          appId: import.meta.env.VITE_META_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v18.0',
        });
        setIsLoaded(true); // This is safe because it's inside an async callback
      } catch (err) {
        setError("Meta SDK initialization failed."+ (err instanceof Error ? ` ${err.message}` : ''));
      }
    };

    // 3. Inject the script if it doesn't exist.
    if (!document.getElementById('facebook-jssdk')) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      
      script.onerror = () => {
        setError("Failed to load Meta SDK script. Please check your connection.");
      };

      document.body.appendChild(script);
    }
    // Note: No 'else' block calling setIsLoaded here. 
    // If the script exists but FB isn't ready, fbAsyncInit will handle it.
  }, []);

  return { isLoaded, error };
};