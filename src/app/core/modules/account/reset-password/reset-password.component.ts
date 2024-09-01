import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { UserProfileService } from "src/app/core/services/user.service";
import { ToastService } from "../../../../shared/Service-common/toast-service";
import { Router } from "@angular/router";
@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
})
export class ResetPasswordComponent implements OnInit {
  // Login Form
  passresetForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = "";
  returnUrl!: string;
  // set the current year
  year: number = new Date().getFullYear();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserProfileService,
    public toastservice: ToastService,
    private route: Router
  ) {}

  ngOnInit(): void {
    /**
     * Form Validatyion
     */
    this.passresetForm = this.formBuilder.group({
      UserName: ["", [Validators.required]],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.passresetForm.controls;
  }
  get UserName() {
    return this.passresetForm.get("UserName");
  }
  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.passresetForm.invalid) {
      return;
    }
    this.resetPassword(this.passresetForm.get("UserName").value);
  }

  resetPassword(username: any) {
    this.userService.resetPasswordByUser(username).subscribe(
      (res: any) => {
        this.toastservice.show("Reset Password succesfully", {
          classname: "bg-success text-center text-white",
          delay: 1000,
        });
        this.route.navigate(["/auth/login"]);
      },
      (err) => {
        this.toastservice.show(err, {
          classname: "bg-danger text-center text-white",
          delay: 1000,
        });
      }
    );
  }
}
