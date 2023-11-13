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
