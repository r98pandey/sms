import { Component, OnInit, EventEmitter, Output, Inject, ViewChild, ElementRef, ChangeDetectorRef } from "@angular/core";
import { DOCUMENT } from "@angular/common";

import { TranslateService } from "@ngx-translate/core";

import { CartModel } from "./topbar.model";
import { cartData } from "./data";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { AuthfakeauthenticationService } from "src/app/core/services/authfake.service";
import { EventService } from "src/app/core/services/event.service";
import { LanguageService } from "src/app/core/services/language.service";
import { TokenStorageService } from "src/app/core/services/token-storage.service";
import { AuthAssetService } from "../../../services/auth-asset.service";
import { SignalRService } from "src/app/core/services/signal-r.service";
import { HubConnection } from "@microsoft/signalr";
import Swal from "sweetalert2";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { environment } from "src/environments/environment";
import { UserProfileService } from "src/app/core/services/user.service";
import { SuccessModalComponent } from "src/app/shared/components/success-modal/success-modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { CommonFunctionService } from "src/app/shared/Service-common/common-function.service";

@Component({
  selector: "app-topbar",
  templateUrl: "./topbar.component.html",
  styleUrls: ["./topbar.component.scss"],
})
export class TopbarComponent implements OnInit {
  element: any;
  message: any;
  mode: string | undefined;
  @Output() mobileMenuButtonClicked = new EventEmitter();
  storeNotificationArray: any = [];
  flagvalue: any;
  valueset: any;
  countryName: any;
  cookieValue: any;
  userData: any;
  cartData!: CartModel[];
  total = 0;
  cart_length: any = 0;
  breadCrumbItems: any;
  _userFullName: any;
  _userRole: any;
  _userImgae: any;
  _userAccessGroupName: any;
  hubConnection: HubConnection;
  _userName: any;
  imageUrl: any = environment.apiUrl;
  countRealTimeNotification: number = 0;
  pushActive: boolean = false;
  currentBuildVersion: any
  @ViewChild("clearCookiesDataModal", { static: true })
  clearCookiesDataModal: ElementRef;
  currentStatus: any;
  currentStatusRemark: any = ''
  currentStatusListArray: any[] = ['Available',
    'Busy',
    'Do not disturb',
    'Be right back',
    'Appear away',
    'Appear offline',
    'On Leave',
    'Half Day',]
  maxCurrentStatusRemark: number = 100;
  @ViewChild("modalStatusRemark", { static: true })
  modalStatusRemark: ElementRef;
  constructor(
    @Inject(DOCUMENT) private document: any,
    private eventService: EventService,
    public languageService: LanguageService,
    public _cookiesService: CookieService,
    public translate: TranslateService,
    private authService: AuthenticationService,
    private authAssetService: AuthAssetService,
    private signalRService: SignalRService,
    private router: Router,
    private TokenStorageService: TokenStorageService,
    private userProfileService: UserProfileService,
    private modalService: NgbModal,
    private userService: UserProfileService,
    public formBuilder: FormBuilder,
    public commonService: CommonFunctionService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.currentStatus = this.authAssetService.getCurrentStatus()
    this.currentStatusRemark = this.authAssetService.getCurrentStatusRemark() ? this.authAssetService.getCurrentStatusRemark() : ''
    this.storeNotificationArray = localStorage.getItem("storeNotificationArray")
      ? JSON.parse(localStorage.getItem("storeNotificationArray"))
      : [];
    this.currentBuildVersion = this.authAssetService.getBuildVersionValue();
    console.log("  this.currentBuildVersion ", this.currentBuildVersion)
    this.userData = this.TokenStorageService.getUser();
    this._userFullName = this.authAssetService.getFullName();
    this._userName = this.authAssetService.getUserName();
    this._userRole = this.authAssetService.getRole();
    this._userImgae = this.authAssetService.getprofileImageUrl();
    this._userAccessGroupName = this.authAssetService.getaccessGroupName();
    this.getBuildVersion();
    this.initialiseSignalRFunction();
    this.requestPermissionchecker();

    this.listen();

    this.element = document.documentElement;

    // Cookies wise Language set
    this.cookieValue = this._cookiesService.get("lang");
    const val = this.listLang.filter((x) => x.lang === this.cookieValue);
    this.countryName = val.map((element) => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) {
        this.valueset = "assets/images/flags/us.svg";
      }
    } else {
      this.flagvalue = val.map((element) => element.flag);
    }

    // Fetch Data
    this.cartData = cartData;
    this.cart_length = this.cartData.length;
    this.cartData.forEach((item) => {
      var item_price = item.quantity * item.price;
      this.total += item_price;
    });

    if (document.documentElement.clientWidth <= 1024) {
      document.documentElement.setAttribute("data-sidebar-size", "sm");
    }
  }
  getBuildVersion() {
    this.authAssetService.GetBuildVersion().subscribe((res: any) => {

      if (res.buildVersion !== this.currentBuildVersion) {
        this.openModalUpForversion(this.clearCookiesDataModal)
      }
    })
  }
  gotoUserProfile() {
    if (JSON.parse(localStorage.getItem("currentUser")).role != "Super Admin") {
      if (
        JSON.parse(localStorage.getItem("currentUser")).role === "Client User"
      ) {
        {
          this.router.navigate([
            "application-settings/user-management/client-user/dashboard-client",
          ]);
        }
      } else {
        this.router.navigate([
          "application-settings/user-management/user/dashboard-user-view/" + this.authAssetService.getUserInfoID(),
        ]);
      }
    }
  }
  initialiseSignalRFunction() {
    // conection start
    this.hubConnection = this.signalRService.getSignLrConnection();
    this.hubConnection.on("GetNotificationToken", (data) => {

      this.hubConnection
        .invoke("GetDataFromClient", this._userName, data)
        .catch((err) => {
          this.hubConnection = this.signalRService.getSignLrConnection();
        });

    });

    this.hubConnection.on("GetclientTokenDetail", (data) => {

      if (this.extractBuildVersion(data) !== this.currentBuildVersion) {
        this.openModalUpForversion(this.clearCookiesDataModal)
      }


    });
    this.hubConnection.on("CheckBuildVersion", (data) => {

      if (data !== this.currentBuildVersion) {
        this.openModalUpForversion(this.clearCookiesDataModal)
      }
    });
    this.hubConnection.on("MyStatusUpdate", (data) => {

      this.currentStatus = data;

      this.updatelocastroge(data, 'currentStatus');
      this.cdr.detectChanges();
    });

    this.hubConnection.on("ForceLogout", (data) => {
      this.stopConnection();
      this.authAssetService.signout();
      this.authService.logout();
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(["/auth/lock-page"]).then(() => {
        window.location.reload();
      });
      // this.router.navigate([""]);
    });



    // InactiveUser


    this.hubConnection.on("InactiveUser", (data) => {
      console.log("fd", data)
      this.stopConnection();
      this.authAssetService.signout();
      this.authService.logout();
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(["/auth/inactive-user-page"]).then(() => {
        window.location.reload();
      });
      // this.router.navigate([""]);
    });


    // end of default method

    //Subscribe the Task
    this.hubConnection.on("PullPendingTask", (data) => { });
    this.hubConnection.on("V2_TicketingProcess", (data) => {
      this.countRealTimeNotification = this.countRealTimeNotification + 1;
      data.date = new Date();

      this.success(data);
      this.storeNotificationArray.push(data);
      this.playBoop()
      localStorage.setItem(
        "storeNotificationArray",
        JSON.stringify(this.storeNotificationArray)
      );
    });
  }
  extractBuildVersion(input: string): string {
    const match = input.match(/Build Version: ([^\s]+)/);
    return match ? match[1] : '';
  }
  public stopConnection() {
    this.hubConnection
      .stop()
      .then(() => { })
      .catch((err) => { });
  }

  removeToHtml(str) {
    let st = str.replace(/<[^>]+>/g, '');

    return st.replace('<a href=" ', '')

  }
  success(res: any, firbase = false) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res.action,
      text: this.removeToHtml(res.message),
      showConfirmButton: false,
      timer: firbase ? 1000 : 10000,
      showCloseButton: true, // Add this line
    });
  }
  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    document.querySelector(".hamburger-icon")?.classList.toggle("open");
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
    if (document.documentElement.clientWidth <= 1024) {
      if (document.documentElement.getAttribute("data-layout") == "vertical") {
        document.documentElement.getAttribute("data-sidebar-size") == "sm"
          ? document.documentElement.setAttribute("data-sidebar-size", "lg")
          : document.documentElement.setAttribute("data-sidebar-size", "sm");
      }
      if (document.documentElement.getAttribute("data-layout") == "horizontal")
        document.body.classList.toggle("menu");
    }
    if (document.documentElement.clientWidth <= 767) {
      document.body.classList.toggle("vertical-sidebar-enable");
      document.documentElement.setAttribute("data-sidebar-size", "lg");
    }
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle("fullscreen-enable");
    if (
      !document.fullscreenElement &&
      !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement
    ) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }
  private async playSoundWav(url: string, vol: number, duration: number): Promise<void> {
    try {
      const audioContext = new AudioContext();
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;

      const gainNode = audioContext.createGain();
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      gainNode.gain.value = vol * 0.01;

      source.start(audioContext.currentTime);
      source.stop(audioContext.currentTime + duration * 0.001);
    } catch (error) {
      console.error('Error loading or playing sound:', error);
    }
  }


  playSong() {
    navigator.vibrate([300, 300, 300]);
  }
  playBoop() {
    console.log("ggs")
    this.playSoundWav('../../../../../assets/mixkit-long-pop-2358.wav', 50, 100);
  }
  /**
   * Topbar Light-Dark Mode Change
   */
  changeMode(mode: string) {
    this.mode = mode;
    this.eventService.broadcast("changeMode", mode);

    switch (mode) {
      case "light":
        document.body.setAttribute("data-bs-theme", "light");
        document.body.setAttribute("data-sidebar", "light");
        break;
      case "dark":
        document.body.setAttribute("data-bs-theme", "dark");
        document.body.setAttribute("data-sidebar", "dark");
        break;
      default:
        document.body.setAttribute("data-bs-theme", "light");
        break;
    }
  }

  /***
   * Language Listing
   */
  listLang = [
    { text: "English", flag: "assets/images/flags/us.svg", lang: "en" },
    { text: "Española", flag: "assets/images/flags/spain.svg", lang: "es" },
    { text: "Deutsche", flag: "assets/images/flags/germany.svg", lang: "de" },
    { text: "Italiana", flag: "assets/images/flags/italy.svg", lang: "it" },
    { text: "русский", flag: "assets/images/flags/russia.svg", lang: "ru" },
    { text: "中国人", flag: "assets/images/flags/china.svg", lang: "ch" },
    { text: "français", flag: "assets/images/flags/french.svg", lang: "fr" },
    { text: "Arabic", flag: "assets/images/flags/ae.svg", lang: "ar" },
  ];

  /***
   * Language Value Set
   */
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }

  /**
   * Logout the user
   */


  windowScroll() {
    // if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    //   (document.getElementById("back-to-top") as HTMLElement).style.display = "block";
    //   document.getElementById('page-topbar')?.classList.add('topbar-shadow')
    // } else {
    //   (document.getElementById("back-to-top") as HTMLElement).style.display = "none";
    //   document.getElementById('page-topbar')?.classList.remove('topbar-shadow')
    // }
  }

  // Delete Item
  deleteItem(event: any, id: any) {
    var price = event.target
      .closest(".dropdown-item")
      .querySelector(".item_price").innerHTML;
    var Total_price = this.total - price;
    this.total = Total_price;
    this.cart_length = this.cart_length - 1;
    this.total > 1
      ? ((document.getElementById("empty-cart") as HTMLElement).style.display =
        "none")
      : ((document.getElementById("empty-cart") as HTMLElement).style.display =
        "block");
    document.getElementById("item_" + id)?.remove();
  }

  // Search Topbar
  Search() {
    var searchOptions = document.getElementById(
      "search-close-options"
    ) as HTMLAreaElement;
    var dropdown = document.getElementById(
      "search-dropdown"
    ) as HTMLAreaElement;
    var input: any,
      filter: any,
      ul: any,
      li: any,
      a: any | undefined,
      i: any,
      txtValue: any;
    input = document.getElementById("search-options") as HTMLAreaElement;
    filter = input.value.toUpperCase();
    var inputLength = filter.length;

    if (inputLength > 0) {
      dropdown.classList.add("show");
      searchOptions.classList.remove("d-none");
      var inputVal = input.value.toUpperCase();
      var notifyItem = document.getElementsByClassName("notify-item");

      Array.from(notifyItem).forEach(function (element: any) {
        var notifiTxt = "";
        if (element.querySelector("h6")) {
          var spantext = element
            .getElementsByTagName("span")[0]
            .innerText.toLowerCase();
          var name = element.querySelector("h6").innerText.toLowerCase();
          if (name.includes(inputVal)) {
            notifiTxt = name;
          } else {
            notifiTxt = spantext;
          }
        } else if (element.getElementsByTagName("span")) {
          notifiTxt = element
            .getElementsByTagName("span")[0]
            .innerText.toLowerCase();
        }
        if (notifiTxt)
          element.style.display = notifiTxt.includes(inputVal)
            ? "block"
            : "none";
      });
    } else {
      dropdown.classList.remove("show");
      searchOptions.classList.add("d-none");
    }
  }

  /**
   * Search Close Btn
   */
  closeBtn() {
    var searchOptions = document.getElementById(
      "search-close-options"
    ) as HTMLAreaElement;
    var dropdown = document.getElementById(
      "search-dropdown"
    ) as HTMLAreaElement;
    var searchInputReponsive = document.getElementById(
      "search-options"
    ) as HTMLInputElement;
    dropdown.classList.remove("show");
    searchOptions.classList.add("d-none");
    searchInputReponsive.value = "";
  }

  requestPermissionForGetToken() {
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: environment.firebase.vapidKey })
      .then((currentToken) => {
        if (currentToken) {
          this.updateFirebaseWebByUser(currentToken);
        } else {
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
      });
  }

  requestPermissionchecker() {
    const messaging = getMessaging();
    Notification.requestPermission()
      .then((permission) => {
        if (permission == "granted") {
          this.pushActive = true;
          this.requestPermissionForGetToken();
        } else {
          this.pushActive = false;
          this.updateFirebaseWebByUser("");
        }
      })
      .catch((e) => { });
  }
  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      // ...
    });
  }

  updateFirebaseWebByUser(FirebaseTokenWeb) {
    let payload: any = {};
    if (FirebaseTokenWeb) {
      payload.FirebaseTokenWeb = FirebaseTokenWeb;
    }
    this.userProfileService
      .updateFirebaseWebByUser(payload)
      .subscribe((res: any) => {
        if (FirebaseTokenWeb) {
          this.success(res, true);
        }
      });
  }

  UpdateUserCurrentStatus_Portal(status) {
    let payload: any = {};
    payload.CurrentStatus = status;
    this.userProfileService
      .UpdateUserCurrentStatus_Portal(payload)
      .subscribe((res: any) => {
        // this.currentStatus = status;
        this.success(res);

        this.updatelocastroge(status, 'currentStatus');
        this.openModalUpdateStatus()

      });
  }

  openModalUpdateStatus() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Do you want to update the message status remark? ?";
    modalRef.componentInstance.buttonName = "Update It";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.changeStatusRemarkModalUpcontent(this.modalStatusRemark, '');
        }
      }
    });
  }
  UpdateUserCurrentStatusRemark_Portal(CurrentStatusRemark) {
    let payload: any = {};
    payload.CurrentStatusRemark = CurrentStatusRemark;
    this.userProfileService
      .UpdateUserCurrentStatusRemark_Portal(payload)
      .subscribe((res: any) => {
        this.currentStatusRemark = CurrentStatusRemark;
        this.success(res);
        this.updatelocastroge(CurrentStatusRemark, 'currentStatusRemark')

      });
  }
  updatelocastroge(status, type) {
    let userString = localStorage.getItem("vam-user");
    let userObject = JSON.parse(userString);
    userObject.userInfor[type] = status;
    let updatedUserString = JSON.stringify(userObject);
    localStorage.setItem("vam-user", updatedUserString);

  }

  moveToActive() {
    this.userProfileService.activeFirebase = "Active";
    this.router.navigate(["/firebase/firebase-page"]);
  }

  openModalCreateConf() {
    const modalRef = this.modalService.open(SuccessModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title =
      "Are you sure you want to change your current password?";
    modalRef.componentInstance.subTitle =
      "Please note that once the password change is successful,you will be logged out of the portal. ";
    modalRef.componentInstance.subTitle1 =
      "You will need to log in again using your new password.  ";
    modalRef.componentInstance.subTitle2 =
      "Make sure to remember your new password to regain access to your account. ";
    modalRef.componentInstance.buttonName = "Change It";

    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {
          this.userChangePassword();
        }
      }
    });
  }

  resetPassword(username: any) {
    this.userService.resetPassword(username).subscribe((res: any) => {
      this.success(res);
    });
  }

  forgotForm!: FormGroup;
  toggle1: boolean = false;
  toggle2: boolean = false;
  toggle3: boolean = false;

  changeType(input_field_password, num) {
    if (input_field_password.type == "password")
      input_field_password.type = "text";
    else input_field_password.type = "password";

    if (num == 1) {
      this.toggle1 = !this.toggle1;
    } else if (num == 2) {
      this.toggle2 = !this.toggle2;
    } else {
      this.toggle3 = !this.toggle3;
    }
  }
  getFormBindChangePassword() {
    this.forgotForm = this.formBuilder.group(
      {
        userName: [
          { value: this._userName, disabled: true },
          Validators.required,
        ],
        currentPassword: ["", Validators.required],
        newpassword: [
          null,
          Validators.compose([
            Validators.required,
            CustomValidators.patternValidator(/^[A-Z]/, { startsWithLetter: true }), // First character is a letter
            CustomValidators.patternValidator(/\d/, { hasNumber: true }),
            CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
            CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
            CustomValidators.patternValidator(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, { hasSpecialCharacters: true }),
            CustomValidators.patternValidator(/^(?=.*[A-Za-z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*\d)(?!(.*\s)).{1,}$/, { hasSpecialCharacters: true }),
            Validators.minLength(12),
            Validators.maxLength(32),
          ]),
        ],
        ConfirmPassword: [null, Validators.compose([Validators.required])],
      },
      { validator: CustomValidators.passwordMatchValidator }
    );
  }
  get userName() {
    return this.forgotForm.get("userName");
  }
  get currentPassword() {
    return this.forgotForm.get("currentPassword");
  }
  get newpassword() {
    return this.forgotForm.get("newpassword");
  }
  get ConfirmPassword() {
    return this.forgotForm.get("ConfirmPassword");
  }
  changePasswordOpenModalUp(content) {
    this.getFormBindChangePassword();
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {
          this.openModalCreateConf();
        },
        (reason) => { }
      );
  }
  changeStatusRemarkModalUpcontent(content: any, currrentStatusRemark: any) {
    this.currentStatusRemark = currrentStatusRemark
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        backdrop: "static",
        keyboard: false,
      })
      .result.then(
        (result) => {
          this.UpdateUserCurrentStatusRemark_Portal(this.currentStatusRemark);
        },
        (reason) => {
          this.currentStatusRemark = this.authAssetService.getCurrentStatusRemark() ? this.authAssetService.getCurrentStatusRemark() : ''

        }
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

  userChangePassword() {
    let requestData = {
      CurrentPassword: this.currentPassword.value,
      NewPassword: this.newpassword.value,
      ConfirmPassword: this.ConfirmPassword.value,
      UserName: this.userName.value,
    };
    this.userProfileService.userChangePassword(requestData).subscribe(
      (res: any) => {
        this.success(res);
        this.onLogout();
      },
      (err) => {
        if (err.error.errors.ConfirmPassword[0]) {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "warning",
            title: err.error.errors.ConfirmPassword[0],
            showConfirmButton: false,
            timer: 1000,
          });
        } else if (err.error.code == 400) {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "warning",
            title: err.error.message,
            showConfirmButton: false,
            timer: 1000,
          });
        } else if (err.error.code == 500) {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "warning",
            title: err.error.message[0].code,
            showConfirmButton: false,
            timer: 1000,
          });
        }
      }
    );
  }

  returnCurrentStatusClassesStatus(value: any) {
    return this.commonService.getStatusColor(value);
  }

  returnCurrentStatusClassesStatusCircle(value: any) {
    return this.commonService.getStatusColorCircle(value);
  }
  returnCurrentStatusClassesStatusCircleNav(value: any) {
    return this.commonService.getStatusColorTop(value);
  }


  onLogout() {
    this.stopConnection();
    this.authService.logout();
    this.authAssetService.signout();
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(["/auth/login"]);
    location.reload();
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


}
export class CustomValidators {
  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }

  static passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password: string = control.get('newpassword').value;
    const confirmPassword: string = control.get('ConfirmPassword').value;

    if (password !== confirmPassword) {
      return { passwordsNotMatch: true };
    }

    return null;
  }


}