import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { ToastService } from "src/app/shared/Service-common/toast-service";
import Swal from "sweetalert2";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {
  // Login Form
  passresetForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType: boolean = false;
  passwordField: boolean = false;
  confirmField: boolean = false;
  error = "";
  returnUrl!: string;
  // set the current year
  year: number = new Date().getFullYear();
  resetPassword: any;
  secureValueList: any;
  errorMessage: any;
  linkExpierd: boolean;
  changesedPassword: boolean;
  response: any;
  constructor(
    private formBuilder: UntypedFormBuilder,
    public toastservice: ToastService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthAssetService,
    private router: Router
  ) {
    sessionStorage.clear();
    localStorage.clear();

  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      let resetPassword = params["resetPassword"];
      this.resetPassword = resetPassword;
      this.GetResetLogin(resetPassword);
    });
    this.passresetForm = this.formBuilder.group(
      {
        userName: ["", [Validators.required]],
        currentPassword: ["", [Validators.required]],

        password: [
          null,
          Validators.compose([
            Validators.required,
            CustomValidators.patternValidator(/^[A-Z]/, {startsWithLetter: true }), // First character is a letter
            CustomValidators.patternValidator(/\d/, { hasNumber: true }),
            CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
            CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
            CustomValidators.patternValidator(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, { hasSpecialCharacters: true }),
            CustomValidators.patternValidator(/^(?=.*[A-Za-z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*\d)(?!(.*\s)).{1,}$/, { hasSpecialCharacters: true }),
            Validators.minLength(12),
            Validators.maxLength(32),
          ]),
        ],
        cpassword: [null, Validators.compose([Validators.required])],
      },
      { validator: CustomValidators.passwordMatchValidator }
    );

    // Password Validation set
    setTimeout(() => {
      var myInput = document.getElementById(
        "password-input"
      ) as HTMLInputElement;
    
      // When the user clicks on the password field, show the message box
      myInput.onfocus = function () {
        let input = document.getElementById("password-contain") as HTMLElement;
        input.style.display = "block";
      };

      // // When the user clicks outside of the password field, hide the password-contain box
      myInput.onblur = function () {
        let input = document.getElementById("password-contain") as HTMLElement;
        input.style.display = "block";
      };

      // When the user starts to type something inside the password field
      
    }, 200);
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.passresetForm.controls;
  }

  GetResetLogin(secureValue) {
    this.authService.getResetLogin(secureValue).subscribe(
      (res: any) => {
        this.secureValueList = res;
        if (res.code == "200" && res.message == "success") {
          this.linkExpierd = false;
        } else {
          this.errorMessage = res.message;
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: res.message,
            showConfirmButton: false,
            timer: 1000,
          });
          this.linkExpierd = true;
        }
      },
      (err) => {
        this.errorMessage = err;
        if (err == "Not valid. Please contact admin") {
          this.linkExpierd = true;
        } else {
        }
      }
    );
  }
  /**
   * Form submit
   */

  get userName() {
    return this.passresetForm.get("userName");
  }
  get currentPassword() {
    return this.passresetForm.get("currentPassword");
  }
  get newpassword() {
    return this.passresetForm.get("password");
  }
  get ConfirmPassword() {
    return this.passresetForm.get("cpassword");
  }

  onSubmit() {   
    this.submitted = true;
    if (this.passresetForm.invalid) {
      return;
    }
    this.changesedPassword = false;
    let requestData = {
      FirstTimeLoginToken: this.resetPassword,
      CurrentPassword:this.currentPassword.value,
      NewPassword: this.newpassword.value,
      ConfirmPassword: this.ConfirmPassword.value,
      UserName: this.userName.value,
    };
    
    console.log(requestData);
    this.authService.changePasswordForResetPwd(requestData).subscribe( 
      (res: any) => {
        this.response = res;
        this.success(res);
        this.changesedPassword = true;
      },
      (err) => { 
        this.changesedPassword = false; 
        console.log(err.error.code);

        if (err.error.code == 500) {  
        
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "warning",
            title: 'Security Code not valid',
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
        } else if (err.error.errors.ConfirmPassword[0]) { 
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "warning",
            title: err.error.errors.ConfirmPassword[0],
            showConfirmButton: false,
            timer: 1000,
          });
      }
        

      /*  if (err.error.errors.ConfirmPassword[0]) { console.log("6666");
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "warning",
            title: err.error.errors.ConfirmPassword[0],
            showConfirmButton: false,
            timer: 1000,
          });
        } else if (err.error.code == 400) { console.log("22222222");
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "warning",
            title: err.error.message,
            showConfirmButton: false,
            timer: 1000,
          });
        } else if (err.error.code == 500) {  console.log("1133333333331111");
        
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "warning",
            title: err.error.message[0].code,
            showConfirmButton: false,
            timer: 1000,
          });
        }*/
      }
    );
  }

  success(res: any) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res.message,
      showConfirmButton: false,
      timer: 3000,
    });
  }
  /**
   * Password Hide/Show
   */
  togglepasswordField() {
    this.passwordField = !this.passwordField;
  }

  /**
   * Password Hide/Show
   */
  toggleconfirmField() {
    this.confirmField = !this.confirmField;
  }
  gobAck() {
    this.router.navigate(["/auth/login"]);
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
    const password: string = control.get('password').value;
    const confirmPassword: string = control.get('cpassword').value;

    if (password !== confirmPassword) {
      return { passwordsNotMatch: true };
    }

    return null;
  }
}
