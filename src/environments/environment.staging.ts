export const environment = {
  production: false,
  worldskillsAppId: 2100,
  worldskillsApi: 'https://api.worldskills.show',
  worldskillsApiPeople: 'https://api.worldskills.show/people',
  worldskillsClientId: 'a95703d1aa96',
  worldskillsAuthorizeUrl: 'https://auth.worldskills.show/oauth/authorize',
  worldskillsAuthorizeRedirect: 'https://accreditation.worldskills.show/',
  worldskillsAuthorizeUserinfoEndpoint: 'https://auth.worldskills.show/auth/users/loggedIn',
  worldskillsPuppeteer: 'https://api.worldskills.show/auth/sessions/operate_puppet',
  worldskillsAuthUriPatterns: ['api.worldskills.show'],
  environmentWarning: 'This is the staging environment. Changes in this environment might get overwritten.',
  appRoles: {
    ADMIN: 'Admin',
    EDIT: 'Edit',
    EDIT_DELEGATE_TYPES: 'EditDelegateTypes',
    EDIT_POSITIONS: 'EditPositions',
    EDIT_ZONES: 'EditZones',
    PRINT: 'Print'
  }
};
