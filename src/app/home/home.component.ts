import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {
  AuthService,
  GenericUtil,
  NgAuthService,
  RedirectEventHandler,
  User
} from "@worldskills/worldskills-angular-lib";
import {AppService} from "../../services/app/app.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent implements OnInit {

  constructor(private app: AppService, private authService: AuthService, private route: ActivatedRoute,
              private redirect: RedirectEventHandler, private ngAuthService: NgAuthService, private router: Router) {
  }

  get initialized(): boolean {
    return this.app.initialized;
  }

  ngOnInit(): void {
    this.redirect.listen().subscribe(
      url => {
        if (!this.app.initialized) {
          if (GenericUtil.isNullOrUndefined(url)) {
            // logged in with no redirect
            this.redirectToUrl('/events');
          } else {
            if (url !== 'logging-in') {
              // logged in with redirect url
              this.redirectToUrl(url);
            }
          }
        }
      }
    );
  }

  redirectToUrl(url: string) {
    this.ngAuthService.getLoggedInUser(true).subscribe(user => {
      this.app.initialized = true;
      this.redirectUserToUrl(url, user);
    });
  }

  redirectUserToUrl(url: string, user: User) {
    const fallback = () => this.router.navigateByUrl(`/events`);
    this.router.navigateByUrl(url).then(t => {
      if (!t) {
        fallback();
      }
    }).catch(_ => fallback());
  }

  login() {
    this.ngAuthService.login();
  }
}
