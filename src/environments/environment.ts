export const environment1 = {
  production: false,
  worldskillsAppId: 2100,
  worldskillsApi: 'http://localhost:8080',
  worldskillsApiPeople: 'http://localhost:8080/people',
  worldskillsClientId: 'a95703d1aa96',
  worldskillsAuthorizeUrl: 'http://localhost:50300/oauth/authorize',
  worldskillsAuthorizeRedirect: 'http://localhost:4200/',
  worldskillsAuthorizeUserinfoEndpoint: 'http://localhost:50300/auth/users/loggedIn',
  worldskillsPuppeteer: 'https://api.worldskills.show/auth/sessions/operate_puppet',
  worldskillsAuthUriPatterns: ['localhost:8080'],
  environmentWarning: 'This is the local (full) development environment. Happy coding!',
  appRoles: {
    ADMIN: 'Admin',
    EDIT: 'Edit',
    EDIT_DELEGATE_TYPES: 'EditDelegateTypes',
    EDIT_POSITIONS: 'EditPositions',
    EDIT_ZONES: 'EditZones',
    PRINT: 'Print'
  }
};

export const environment = {
  production: false,
  worldskillsAppId: 2100,
  worldskillsApi: 'https://api.worldskills.show',
  worldskillsApiPeople: 'https://api.worldskills.show/people',
  worldskillsClientId: '842ea70be298',
  worldskillsAuthorizeUrl: 'https://auth.worldskills.show/oauth/authorize',
  worldskillsAuthorizeRedirect: 'http://localhost:4200/',
  worldskillsAuthorizeUserinfoEndpoint: 'https://api.worldskills.show/auth/users/loggedIn',
  worldskillsPuppeteer: 'https://api.worldskills.show/auth/sessions/operate_puppet',
  worldskillsAuthUriPatterns: ['localhost', 'api.worldskills'],
  environmentWarning: 'This is the local (staging) development environment. Happy coding!',
  appRoles: {
    ADMIN: 'Admin',
    EDIT: 'Edit',
    EDIT_DELEGATE_TYPES: 'EditDelegateTypes',
    EDIT_POSITIONS: 'EditPositions',
    EDIT_ZONES: 'EditZones',
    PRINT: 'Print'
  }
};
