export const ROUTES = {
    DASHBOARD: '/',
    ACCOUNT: '/account',
    TRAINING: '/training',
  } as const;
  
  // Type for the route values
  export type Route = typeof ROUTES[keyof typeof ROUTES]; 
  
  //for the default route if user is logged in or not
  export function getDefaultRoute(user: any) {
    return (
      user ? ROUTES.DASHBOARD : ROUTES.ACCOUNT
    );
  };