// src/types/facebook.d.ts

/**
 * Defines the authResponse object returned by FB.login
 * as per Meta's official documentation.
 */
interface FacebookAuthResponse {
  accessToken: string;
  expiresIn: number;
  signedRequest: string;
  userID: string;
  grantedScopes?: string;
  code?: string; // This is the specific field needed for the Embedded Signup exchange
}

interface FacebookLoginResponse {
  authResponse: FacebookAuthResponse | null;
  status: 'connected' | 'not_authorized' | 'unknown';
}

interface Window {
  fbAsyncInit: () => void;
  FB: {
    init: (params: {
      appId: string;
      cookie: boolean;
      xfbml: boolean;
      version: string;
    }) => void;
    login: (
      callback: (response: FacebookLoginResponse) => void,
      options?: { 
        scope: string; 
        extras?: {
          feature?: string;
          setup?: Record<string, unknown>;
        } 
      }
    ) => void;
  };
}