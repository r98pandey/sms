import { Injectable } from '@angular/core';
import { getFirebaseBackend } from '../../authUtils';
import { User } from '../models/auth.models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { GlobalComponent } from "../../global-component";
import { environment } from "src/environments/environment";

const _url = GlobalComponent.API_URL;
const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    ApiKey: environment["ApiKey"],
  }),
};

@Injectable({ providedIn: "root" })

/**
 * Auth-service Component
 */
export class AuthenticationService {
  user!: User;
  currentUserValue: any;
  errorCome: boolean = false;

  private currentUserSubject: BehaviorSubject<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("currentUser")!)
    );
  }

  /**
   * Performs the register
   * @param userName userName
   * @param Password Password
   */
  register(userName: string, first_name: string, Password: string) {
    // Register Api
    return this.http.post(
      _url + "signup",
      {
        userName,
        first_name,
        Password,
      },
      httpOptions
    );
  }

  /**
   * Performs the auth
   * @param userName userName of user
   * @param Password Password of user
   */
  login(userName: string, Password: string) {
    return this.http.post(
      _url + "api/Account/LoginUser",
      {
        userName,
        Password,
      },
      httpOptions
    );
  }

  /**
   * Returns the current user
   */
  public currentUser(): any {
    return getFirebaseBackend()!.getAuthenticatedUser();
  }

  sOALoginUser(data: any) {
    let url = environment.apiUrl + "api/SOAAccount/SOALoginUser";
    return this.http.post(url, data, {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("ApiKeySOA", environment.ApiKeySOA),
    });
  }
  /**
   * Logout the user
   */
  logout() {
    localStorage.clear();
    sessionStorage.clear();
  }

  /**
   * Reset Password
   * @param userName userName
   */
  resetPassword(userName: string) {
    return getFirebaseBackend()!
      .forgetPassword(userName)
      .then((response: any) => {
        const message = response.data;
        return message;
      });
  }
}

