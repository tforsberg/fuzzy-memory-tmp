import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {TenantService} from './tenant.service';
import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AppState} from '../store';
import {select, Store} from '@ngrx/store';
import {concatMap, filter, map, tap, withLatestFrom} from 'rxjs/operators';
import {isLoggedIn} from '../store/selectors';
import {TenantsDBService} from './tenants-db.service';
import {LoadingService} from './loading.service';
import {
  DEFAULT_SCHOOL_ACCENT_COLOR, DEFAULT_SCHOOL_PRIMARY_COLOR, ONLINECOURSEHOST_ACCENT_COLOR,
  ONLINECOURSEHOST_PRIMARY_COLOR
} from '../common/ui-constants';
import {checkIfPlatformSite, getPlatformSubdomain} from '../common/platform-utils';
import {ThemeChanged} from '../store/platform.actions';
import {Tenant} from '../models/tenant.model';
import {CookieService} from 'ngx-cookie-service';
import {PlatformSettings} from '../models/platform-settings.model';
import {Theme} from '../models/theme.model';

/*
*
*
*  This guard has a couple of very important functions, without which the website can't function:
*
*   - it determines the tenant at application startup time, which will determine which courses
*     and lessons will be shown to the user (as this is a multi-tenant app)
*
*   - it loads the tenant branding styles, without which we cannot even display the site to the user
*
*
* */

const  PLATFORM_COOKIE = 'PLATFORM_SETTINGS';

const ONLINECOURSEHOST_THEME = {
  primaryColor: ONLINECOURSEHOST_PRIMARY_COLOR,
  accentColor: ONLINECOURSEHOST_ACCENT_COLOR
};


@Injectable()
export class PlatformGuard implements CanActivate {

  constructor(private tenant: TenantService,
              private tenantDB: TenantsDBService,
              private afAuth: AngularFireAuth,
              private store: Store<AppState>,
              private router: Router,
              private loading: LoadingService,
              private cookies: CookieService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    if (this.cookies.check(PLATFORM_COOKIE)) {

      const settings: PlatformSettings = JSON.parse(this.cookies.get(PLATFORM_COOKIE));

      this.tenant.id = settings.tenantId;

      this.store.dispatch(new ThemeChanged({primaryColor: settings.activeTheme.primaryColor, accentColor: settings.activeTheme.accentColor}));

      return of(true);
    }
    else {
      return this.determinePlatformSettings();
    }

  }

  determinePlatformSettings(): Observable<boolean> {

    const isPlatformSite = checkIfPlatformSite(),
      subDomain = getPlatformSubdomain();

    return this.afAuth.authState
      .pipe(

        // get the tenant
        concatMap(auth => {

          // platform site main app, logged out: no tenant
          if (isPlatformSite && !auth) {
            this.router.navigate(['/login']);
            return of(undefined);
          }

          // platform site main app, logged in
          else if (isPlatformSite) {
            return this.loading.showLoader(this.tenantDB.findTenantByUid());
          }

          // platform site subdomain
          else if (subDomain) {
            return this.loading.showLoader(this.tenantDB.findTenantBySubdomain(subDomain));
          }

          //TODO custom domain case
          else {

          }

        }),

        tap(tenant => {

          this.setTheme(tenant);

          // setting the tenant id globally (determines what courses get loaded)
          if (tenant) {
            this.tenant.id = tenant.id;
          }

          this.savePlatformCookie(tenant);

        }),

        map(tenant => !!tenant)
      );

  }


  setTheme(tenant: Tenant) {
    if (checkIfPlatformSite()) {
      this.setPlatformBrandColors();
    }
    else if (tenant) {
      this.store.dispatch(new ThemeChanged({primaryColor: tenant.primaryColor, accentColor: tenant.accentColor}));
    }
  }


  setPlatformBrandColors() {
    this.store.dispatch(new ThemeChanged(ONLINECOURSEHOST_THEME));
  }

  savePlatformCookie(tenant: Tenant) {

    let activeTheme: Theme;

    if (checkIfPlatformSite()) {
      activeTheme = ONLINECOURSEHOST_THEME;
    }
    else {
      activeTheme = {
        primaryColor: tenant.primaryColor,
        accentColor: tenant.accentColor
      };
    }

    const settings: PlatformSettings = {
      tenantId: tenant.id,
      activeTheme
    }

    this.cookies.set(PLATFORM_COOKIE, JSON.stringify(settings));

  }


}
