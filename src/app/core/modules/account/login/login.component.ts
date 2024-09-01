import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { ToastService } from "../../../../shared/Service-common/toast-service";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import Swal from "sweetalert2";
import { Lightbox } from "ngx-lightbox";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  // Login Form
  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = "";
  returnUrl!: string;
  setupPageForRegistration: boolean = false;
  // set the current year
  year: number = new Date().getFullYear();
  loadingShown: boolean = false;
  apptype: any;
  version: string = environment.baseVersion;
  @ViewChild("clearCookiesDataModal", { static: true })
  clearCookiesDataModal: ElementRef;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    public toastservice: ToastService,
    public authAssetService: AuthAssetService,
    private lightbox: Lightbox,
    private modalService: NgbModal,

  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(["/"]);
    }
    this.getBuildVersion();
  }

  ngOnInit(): void {
    if (localStorage.getItem("currentUser")) {
      this.router.navigate(["/"]);
    }
    /**
     * Form Validatyion
     */
    this.loginForm = this.formBuilder.group({
      UserName: [null, [Validators.required]],
      Password: [null, [Validators.required]],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";

  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }
  get UserName() {
    return this.loginForm.get("UserName");
  }
  get Password() {
    return this.loginForm.get("Password");
  }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;
    this.authenticationService
      .login(this.f["UserName"].value, this.f["Password"].value)
      .subscribe(
        (data: any) => {
          if (data.errorId == 0) {
            this.loadingShown = true;
            this.toastservice.show("Logged in succesfully", {
              classname: "bg-success text-center text-white",
              delay: 1000,
            });
            setTimeout(() => {
              this.loadingShown = false;
              if (data?.userInfor?.role === "Client User") {
                if (data?.userInfor?.accessGroupName === "Application User") {
                  this.saveToLocalStorage(data);
                  this.router.navigate([
                    "maintenance-management/corrective/ticket/list-ticket",
                  ]);
                } else {
                  this.saveToLocalStorage(data);
                  this.router.navigate([
                    "/maintenance-management/dashboard/client-dashboard",
                  ]);
                }
              } else if (data?.userInfor?.role === "Help Desk") {
                this.saveToLocalStorage(data);
                this.router.navigate([
                  "/maintenance-management/dashboard/help-desk-dashboard",
                ]);
              }
              else if (data?.userInfor?.role === "Human Resource") {
                this.saveToLocalStorage(data);
                this.router.navigate([
                  "/maintenance-management/attendance/daily-attendance",
                ]);
              }
              else if (data?.userInfor?.role === "Asset Administrator") {
                this.saveToLocalStorage(data);
                this.router.navigate([
                  "/maintenance-management/dashboard/asset-dashboard",
                ]);
              } else if (data?.userInfor?.role === "Software Support") {
                if (data?.userInfor?.accessGroupName === "Software Engineer") {
                  this.saveToLocalStorage(data);
                  this.router.navigate([
                    "/software-support/software-dashboard",
                  ]);
                } else if (
                  data?.userInfor?.accessGroupName === "Head Of Department"
                ) {
                  this.saveToLocalStorage(data);
                  this.router.navigate([
                    "/software-support/software-dashboard",
                  ]);
                } else {
                  this.saveToLocalStorage(data);
                  this.router.navigate([
                    "/maintenance-management/dashboard/help-desk-dashboard",
                  ]);
                }
              } else {
                this.saveToLocalStorage(data);
                this.router.navigate(["/"]);
              }
            }, 1000);
          }
        },
        (e) => {
          localStorage.setItem("error", JSON.stringify(e));
          this.authenticationService.errorCome = true;
          if (e.code == 401 && e.errorId == 1) {
            if (e.isSuperAdmin == true) {
              this.saveToLocalStorage(e);
            }
            this.router.navigate(["/error/error-message"]);
          } else if (e.code == 403 && e.errorId == 2) {
            this.router.navigate(["/error/error-message"]);
          } else if (e.code == 500 && e.errorId == 3) {
            this.router.navigate(["/error/error-message"]);
          } else if (e.code == 403 && e.errorId == 4) {
            this.router.navigate(["/error/error-message"]);
          } else if (e.code == 403 && e.errorId == 5) {
            this.router.navigate(["/error/error-message"]);
          } else if (e.code == 401 && e.errorId == 6) {
            this.toastservice.show("Unauthorized", {
              classname: "bg-danger text-center text-white",
              delay: 1000,
            });
          }
        }
      );
  }

  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  saveToLocalStorage(data) {
    this.authAssetService.createSession(data);
    localStorage.setItem("currentUser", JSON.stringify(data.userInfor));
    localStorage.setItem("token", data.token);
  }

  openAndroid() {
    const album = {
      src: "../../../../../assets/images/sms-android-app-qr 1.png",
      caption: "Download For Android Device",
      thumb: "thumb",
    };
    const album1 = {
      src: "../../../../../assets/images/sms-app-ios-qr 1.png",
      caption: "Download For Apple Device",
      thumb: "thumb",
    };

    let _albums: any = [];
    _albums.push(album, album1);
    this.lightbox.open(_albums);
  }
  openIos() {
    const album = {
      src: "../../../../../assets/images/sms-app-ios-qr 1.png",
      caption: "Download For Apple Device",
      thumb: "thumb",
    };
    const album1 = {
      src: "../../../../../assets/images/sms-android-app-qr 1.png",
      caption: "Download For Android Device",
      thumb: "thumb",
    };
    let _albums: any = [];
    _albums.push(album, album1);
    this.lightbox.open(_albums);
  }
  confirmForViewImage(content, value: any) {
    this.apptype = value
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        size: "sm",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => { },
        (reason) => { }
      );
  }
  // ,0,{
  //   centerVertically: true,
  // cssClass: 'custom-lightbox',
  // }

  getBuildVersion() {
    this.authAssetService.GetBuildVersion().subscribe((res: any) => {

      if (res.buildVersion !== this.version) {
        this.openModalUpForversion(this.clearCookiesDataModal)
      }
    })
  }

  openModalUpForversion(content) {
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        keyboard: false,
        size: 'lg'
      })
      .result.then(
        (result) => {

        },
        (reason) => { }
      );
  }

  clearCookies(): void {

    const cookies = document.cookie.split(";");
    cookies.forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      const domainParts = window.location.hostname.split(".");
      while (domainParts.length > 0) {
        const domain = domainParts.join(".");
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${domain}`;
        domainParts.shift();
      }
    });
    this.modalService.dismissAll();
    this.onLogout();
  }
  onLogout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(["/auth/login"]);
    location.reload();
  }

}
