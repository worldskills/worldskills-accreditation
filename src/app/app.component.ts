import {Component, OnInit} from '@angular/core';
import {MenuItem, NgAuthService, User, WorldskillsAngularLibService} from "@worldskills/worldskills-angular-lib";
import {environment} from "../environments/environment";
import {Router} from "@angular/router";
import {AppService} from "../services/app/app.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  showBreadcrumb = true;
  showWSLayout = true;
  currentUser: User;
  menuItems: Array<MenuItem> = [];
  environmentWarning = environment.environmentWarning;

  constructor(
    private authService: NgAuthService,
    private wsi: WorldskillsAngularLibService,
    private router: Router,
    private appService: AppService
  ) {

  }

  get isLoggedIn() {
    return this.authService.isLoggedIn() && this.currentUser != null;
  }

  ngOnInit(): void {
    this.appService.showBreadcrumbs.subscribe(showBreadcrumb => setTimeout(() => (this.showBreadcrumb = showBreadcrumb)));
    this.appService.showWSLayout.subscribe(showWSLayout => setTimeout(() => (this.showWSLayout = showWSLayout)));

    this.wsi.authConfigSubject.next({
      loginUrl: environment.worldskillsAuthorizeUrl,
      redirectUri: environment.worldskillsAuthorizeRedirect,
      userinfoEndpoint: environment.worldskillsAuthorizeUserinfoEndpoint,
      clientId: environment.worldskillsClientId,
      requireHttps: environment.production,
      oidc: false
    });

    this.wsi.httpConfigSubject.next({
      encoderUriPatterns: [],
      authUriPatterns: environment.worldskillsAuthUriPatterns
    });

    this.wsi.serviceConfigSubject.next({
      appCode: [environment.worldskillsAppId],
      apiEndpoint: environment.worldskillsApi
    });

    this.authService.currentUser.subscribe(currentUser => {
      this.currentUser = currentUser;

      this.initMenuItems();
    });

    if (environment.fontTrackingCode) {
      (window as any).MTUserId='94ee3747-9a1d-466d-acf9-bbeb8cbd7714';
      (window as any).MTFontIds = new Array();

      (window as any).MTFontIds.push("1572247"); // Frutiger® W04 45 Light 
      (window as any).MTFontIds.push("1572251"); // Frutiger® W04 46 Light Italic 
      (window as any).MTFontIds.push("1572255"); // Frutiger® W04 55 Roman 
      (window as any).MTFontIds.push("1572259"); // Frutiger® W04 56 Italic 
      (window as any).MTFontIds.push("1572263"); // Frutiger® W04 65 Bold 
      (window as any).MTFontIds.push("762077"); // Neue Frutiger® W10 Black 
      (window as any).MTFontIds.push("762119"); // Neue Frutiger® W10 Extra Black 
      (function() {
          var mtTracking = document.createElement('script');
          mtTracking.type='text/javascript';
          mtTracking.async=true;
          mtTracking.src='https://worldskills.org/application/themes/worldskills_org/js/mtiFontTrackingCode.js';

          (document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(mtTracking);
      })();
    }
  }

  login() {
    this.authService.login();
  }

  logout() {
    if (this.authService.isLoggedIn()) {
      this.authService.logout().subscribe(() => {
        sessionStorage.clear();
        localStorage.clear();
        this.navigateToHome();
      }, () => {
        sessionStorage.clear();
        localStorage.clear();
        this.navigateToHome();
      });
    }
  }

  onActivate($event: any) {
    if (this.router.url.trim() !== '/') {
      this.appService.initialized = true;
    }
  }


  private navigateToHome(): void {
    this.router.navigate(['/']);
  }

  private initMenuItems(): void {

  }
}
