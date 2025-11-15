// import { deviceAuthorizationClient } from 'better-auth/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: 'http://localhost:8080',

  // plugins: [deviceAuthorizationClient()],
});
