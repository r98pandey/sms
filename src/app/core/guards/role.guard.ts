import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthAssetService } from '../services/auth-asset.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthAssetService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const allowedRoles = next.data['allowedRoles']; // Define allowedRoles in route data

    if (allowedRoles.includes(this.authService.getRole())) {
      return true;
    } else {
      // Navigate to unauthorized page or redirect to a default page
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
}
