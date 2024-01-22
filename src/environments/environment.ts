export const environment = {
  production: false,
  fontTrackingCode: false,
  worldskillsAppId: 2100,
  worldskillsApi: 'http://localhost:8080',
  worldskillsApiAccreditation: 'http://localhost:8080/accreditation',
  worldskillsApiImages: 'http://localhost:8080/images',
  worldskillsApiOrg: 'http://localhost:8080/org',
  worldskillsApiPeople: 'http://localhost:8080/people',
  worldskillsPeople: 'https://people.worldskills.org',
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
    UPLOAD_PHOTO: 'UploadPhoto',
    EDIT_DELEGATE_TYPES: 'EditDelegateTypes',
    EDIT_POSITIONS: 'EditPositions',
    EDIT_ZONES: 'EditZones',
    EDIT_PACKAGE_OPTIONS: 'EditPackageOptions',
    PRINT: 'Print',
    AD_HOC_PRINT: 'AdHocPrint',
    SET_UP_SCAN_APP: 'SetUpScanApp'
  }
};
