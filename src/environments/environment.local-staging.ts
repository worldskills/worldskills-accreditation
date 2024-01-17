export const environment = {
  production: false,
  fontTrackingCode: false,
  worldskillsAppId: 2100,
  worldskillsApi: 'https://api.worldskills.show',
  worldskillsApiAccreditation: 'https://api.worldskills.show/accreditation',
  worldskillsApiOrg: 'https://api.worldskills.show/org',
  worldskillsApiPeople: 'https://api.worldskills.show/people',
  worldskillsPeople: 'https://people.worldskills.org',
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
    EDIT_PACKAGE_OPTIONS: 'EditPackageOptions',
    PRINT: 'Print',
    AD_HOC_PRINT: 'AdHocPrint',
    SET_UP_SCAN_APP: 'SetUpScanApp'
  }
};
