import { Injectable } from "@angular/core";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthenticationService } from "../services/auth.service";
import Swal from "sweetalert2";
import { ToastService } from "../../shared/Service-common/toast-service";
import { environment } from "src/environments/environment";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Location } from '@angular/common';
import { MessageModalComponent } from "src/app/shared/components/message-modal/message-modal.component";
@Injectable()
export class ErrorCatchingInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private toastService: ToastService,
    private modalService: NgbModal, public location: Location
  ) { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    if (request.url.includes(environment.apiUrl + 'api/ChangePwd/ChangePasswordForResetPwd')) {
      return next.handle(request);
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = "";

        if (error?.error?.code == 401 && error.error.errorId == 1) {
          errorMsg = error.error;
        } else if (error?.error?.code == 403 && error.error.errorId == 2) {
          errorMsg = error.error;
        } else if (error?.error?.code == 500 && error.error.errorId == 3) {
          errorMsg = error.error;
        } else if (error?.error?.code == 403 && error.error.errorId == 4) {
          errorMsg = error.error;
        } else if (error?.error?.code == 403 && error.error.errorId == 5) {
          errorMsg = error.error;
        } else if (error?.error?.code == 401 && error.error.errorId == 6) {
          this.showErrorMssage(
            error?.error?.message ? error?.error?.message : " Unauthorized"
          );
        } else if (error.status == 400 && error.error.errorId == 6) {
          this.showErrorMssage(
            error?.error?.message
              ? error?.error?.message
              : " Something Went wrong"
          );
        } else if (error.status === 401) {
          this.showErrorMssage(
            error?.error?.message ? error?.error?.message : " Unauthorized"
          );
          this.authenticationService.logout();
          setTimeout(() => {
            location.reload();
          }, 1500);
        } else if (error.status == 411 || error.status == 410) {
          errorMsg = `${error?.error?.message}`;
        } else if (error.status == 404) {
          this.showErrorSwal("Not found");
          errorMsg = `${error?.error?.message ? error?.error?.message : "Not found"
            }`;
        } else if (error.status == 400) {
          console.log("error?.error?.message", error?.error.message)
          errorMsg = `${error?.error?.message
            ? error?.error?.message
            : "Something went wrong"
            }`;
          this.showErrorSwal(errorMsg);
          this.errorMessageBoxwith400(request, errorMsg)

        } else if (error.status == 500) {
          errorMsg = `${error?.error?.message
            ? error?.error?.message
            : "Internal Server Error"
            }`;
          this.showErrorSwal(
            error?.error?.message
              ? error?.error?.message
              : "Internal Server Error"
          );
        } else {
          if (error.error) {
            errorMsg = `${error.error}`;
            this.showErrorSwal(error.error?.message);
          } else {
            this.showErrorSwal(error.message);
            errorMsg = `Error Code: ${error.status},  message: ${error.message}`;
          }
        }

        return throwError(errorMsg);
      })
    );
  }

  showErrorMssage(err: any) {
    this.toastService.show(err, {
      classname: "bg-danger text-center text-white",
      delay: 3000,
    });
    // //console.log(this.toastService);
    // // Swal.fire({
    // //   toast: true,
    // //   position: "top-end",
    // //   icon: "error",
    // //   title: err,
    // //   showConfirmButton: false,
    // //   timer: 5000,
    // // });
  }
  showErrorSwal(err: any) {
    // this.toastService.show(err, {
    //   classname: "bg-danger text-center text-white",
    //   delay: 3000,
    // });
    if (err) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: err,
        showConfirmButton: false,
        timer: 5000,
      });
    }
  }

  errorMessageBoxwith400(request, message) {
    if (!this.isMatchingUrlNotToshown(request.url)) {
      const modalRef = this.modalService.open(MessageModalComponent, {
        ariaLabelledBy: "modal-basic-title",
        size: "md",
        centered: true,
        backdrop: "static",
        keyboard: false,
      });
      modalRef.componentInstance.title = message
      modalRef.componentInstance.subTitle = "";
      modalRef.componentInstance.buttonName = 'Ok'
      modalRef.result.then((result) => {
        //console.log(result, "result");
        if (result == "Close click") {

          if (this.isMatchingUrl(request)) {
          } else {
            location.reload();
          }
        }

      });
    }
  }

  isMatchingUrl(url) {
    return url.includes(environment.apiUrl + 'api/ProjectManagement/DeleteV2_ProjectScheduleSubTask') ||
      url.includes(environment.apiUrl + 'api/ProjectManagement/DeleteV2_ProjectScheduleMainTask')
  }


  isMatchingUrlNotToshown(url) {
    console.log(url)
    return url.includes(environment.apiUrl + 'api/Maintenance/StartServiceOrder') ||
      url.includes(environment.apiUrl + 'api/Maintenance/EndServiceOrder')||
      url.includes(environment.apiUrl + 'api/FmsMobileApp/StartTaskPreventive')||  
      url.includes(environment.apiUrl + 'api/FmsMobileApp/EndTaskPreventive')||
      url.includes(environment.apiUrl + 'api/FmsMobileApp/StartTaskAudit')||
      url.includes(environment.apiUrl + 'api/FmsMobileApp/EndTaskAudit')

  }
}
