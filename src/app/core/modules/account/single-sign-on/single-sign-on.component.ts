import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { AuthenticationService } from "src/app/core/services/auth.service";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import Swal from "sweetalert2";
import { ToastService } from "./toast-service";

@Component({
  selector: "app-single-sign-on",
  templateUrl: "./single-sign-on.component.html",
  styleUrls: ["./single-sign-on.component.scss"],
})
export class SingleSignOnComponent implements OnInit {
  // set the current year
  year: number = new Date().getFullYear();
  // Carousel navigation arrow show
  showNavigationArrows: any;
  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = "";
  returnUrl!: string;
  setupPageForRegistration: boolean = false;
  // set the current year
  SoStoken;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    public toastservice: ToastService,
    public authAssetService: AuthAssetService,
    public activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.SoStoken = params.id ? params.id : null;
      this.onSubmit(this.SoStoken);
    });
  }

  ngOnInit(): void {}

  onSubmit(SOAToken) {
    let data = {
      SOAToken: SOAToken,
    };
    this.submitted = true;
    this.authenticationService.sOALoginUser(data).subscribe(
      (data: any) => {
        if (data.errorId == 0) {
          this.authAssetService.createSession(data);
          if (data?.userInfor?.role === "Client User") {
            this.toastservice.show(data.message, {
              classname: "bg-success text-white",
              delay: 15000,
            });
            localStorage.setItem("currentUser", JSON.stringify(data.userInfor));
            localStorage.setItem("token", data.token);

            this.router.navigate([
              "/maintenance-management/dashboard/client-dashboard",
            ]);
          } else if (data?.userInfor?.role === "Help Desk") {
            this.toastservice.show(data.message, {
              classname: "bg-success text-white",
              delay: 15000,
            });
            localStorage.setItem("currentUser", JSON.stringify(data.userInfor));
            localStorage.setItem("token", data.token);

            this.router.navigate([
              "/maintenance-management/dashboard/help-desk-dashboard",
            ]);
          } else {
            this.toastservice.show(data.message, {
              classname: "bg-success text-white",
              delay: 15000,
            });
            localStorage.setItem("token", data.token);
            localStorage.setItem("currentUser", JSON.stringify(data.userInfor));
            this.router.navigate(["/"]);
          }
        } else {
          this.toastservice.show(data.data, {
            classname: "bg-danger text-white",
            delay: 15000,
          });
        }
      },
      (e) => {
        this.router.navigate(["/auth/login"]);
      }
    );
  }

  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
