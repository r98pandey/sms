import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-error-message",
  templateUrl: "./error-message.component.html",
  styleUrls: ["./error-message.component.scss"],
})
export class ErrorMessageComponent implements OnInit {
  error: any;
  btnText: string = "Return to Login";
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    if (this.authenticationService.errorCome == false) {
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(["/"]);
    }
  }

  ngOnInit(): void {
    this.error = JSON.parse(localStorage.getItem("error"));

    if (
      this.error.code == 401 &&
      this.error.errorId == 1 &&
      this.error.isSuperAdmin == true
    ) {
      this.btnText = "Setup Product key";
      
    }
  }

  return(): void {
    if (
      this.error.code == 401 &&
      this.error.errorId == 1 &&
      this.error.isSuperAdmin == true
    ) {
      this.router.navigate(["/auth/registration"]);
    } else {
      this.router.navigate(["/auth/login"]);
      localStorage.removeItem("error");
      localStorage.clear();
      sessionStorage.clear();
    }
  }
  returnSrting(myString) {
    return myString.replace(/\/n/g, "<br><br>");
  }
}
