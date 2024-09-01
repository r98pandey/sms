import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

// Auth Services
import { AuthenticationService } from "../services/auth.service";
import { AuthfakeauthenticationService } from "../services/authfake.service";
import { environment } from "../../../environments/environment";
import jwt_decode from "jwt-decode";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const isTokenExpired = (token) => {
      try {
        const decoded: any = jwt_decode(token);
        const currentTime = new Date().getTime() / 1000;

        return currentTime >= decoded.exp;
      } catch (error) {
        return true
      }
    };

    const notExpired = !isTokenExpired(localStorage.getItem('token'))

   // const currentUser = this.authFackservice.currentUserValue;
    // if (currentUser && notExpired) {
    //   return true
    // }

    // if (localStorage.getItem("currentUser") && notExpired) {
    //     return true
    // }
    
    let error = JSON.parse(localStorage.getItem("error"));
    const isSuperAdminError = error && error.code == 401 && error.errorId == 1 && error.isSuperAdmin == true;
    if (localStorage.getItem("currentUser") && notExpired && !isSuperAdminError) {
      return true;
    }

    this.router.navigate(["/auth/login"], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
