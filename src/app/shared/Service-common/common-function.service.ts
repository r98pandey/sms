import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import * as moment from "moment";
import { parse, differenceInHours, differenceInMinutes } from 'date-fns';

@Injectable({
  providedIn: "root",
})
export class CommonFunctionService {
  constructor(private sanitizer: DomSanitizer, private datePipe: DatePipe) { }

  clean(obj: any) {
    for (var propName in obj) {
      if (
        obj[propName] === null ||
        obj[propName] === undefined ||
        obj[propName] === ""
      ) {
        delete obj[propName];
      }
    }
    return obj;
  }
  returnStatusBadgeClasses(id: any) {
    if (id == 0) {
      return " badge bg-info-subtle   text-info";
    } else if (id == 1) {
      return " badge bg-danger-subtle   text-danger";
    } else if (id == 2) {
      return " badge bg-warning-subtle  text-warning";
    } else if (id == 3) {
      return " badge bg-success-subtle   text-success";
    } else if (id == 4) {
      return " badge bg-danger-subtle   text-danger";
    } else if (id == 5) {
      return " badge bg-warning-subtle   text-warning";
    } else if (id == 6) {
      return " badge bg-danger-subtle   text-danger";
    } else if (id == 7) {
      return " badge bg-warning-subtle   text-warning";
    } else if (id == 8) {
      return " badge bg-danger-subtle   text-danger";
    } else if (id == 9) {
      return " badge bg-danger-subtle   text-danger";
    } else if (id == 10) {
      return " badge bg-light-subtle   text-body";
    } else if (id == 11) {
      return " badge bg-primary-subtle   text-primary";
    } else if (id == 12) {
      return " badge bg-secondary-subtle   text-secondary";
    } else if (id == 13) {
      return " badge bg-danger-subtle   text-danger";
    } else if (id == 14) {
      return " badge bg-light-subtle   text-body";
    } else if (id == 15) {
      return " badge bg-light-subtle   text-body";
    } else if (id == 16) {
      return " badge bg-danger-subtle   text-danger";
    } else if (id == 17) {
      return " badge bg-light-subtle   text-body";
    } else if (id == 18) {
      return " badge bg-light-subtle   text-body";
    } else if (id == 19) {
      return " badge bg-danger-subtle   text-danger";
    } else if (id == 20) {
      return " badge bg-light-subtle   text-body";
    } else if (id == 21) {
      return " badge bg-light-subtle   text-body";
    } else if (id == 22) {
      return " badge bg-light-subtle   text-body";
    } else if (id == 23) {
      return " badge bg-light-subtle   text-body";
    } else if (id == 24) {
      return " badge bg-success-subtle   text-success";
    } else if (id == 25) {
      return " badge bg-success-subtle   text-success";
    } else if (id == 26) {
      return " badge bg-success-subtle   text-success";
    } else if (id == 27) {
      return " badge bg-danger-subtle   text-danger";
    } else if (id == 28) {
      return " badge bg-success-subtle   text-success";
    } else if (id == 29) {
      return " badge bg-info-subtle   text-info";
    } else if (id == 30) {
      return " badge bg-info-subtle   text-info";
    } else if (id == 31) {
      return " badge bg-secondary-subtle   text-secondary";
    } else if (id == 32) {
      return " badge bg-success-subtle   text-success";
    } else if (id == 33) {
      return " badge bg-light-subtle   text-body";
    } else if (id == 34) {
      return " badge bg-danger-subtle   text-danger";
    } else if (id == 35) {
      return " badge bg-success-subtle   text-success";
    } else if (id == 36) {
      return " badge bg-danger-subtle   text-danger";
    } else if (id == 37) {
      return " badge bg-light-subtle   text-body";
    } else if (id == 38) {
      return " badge bg-danger-subtle   text-danger";
    } else if (id == 39) {
      return " badge bg-danger-subtle   text-danger";
    } else if (id == 40) {
      return " badge bg-light-subtle   text-body";
    } else if (id == 41) {
      return " badge bg-light-subtle   text-body";
    } else if (id == 42) {
      return " badge bg-warning-subtle   text-warning";
    } else if (id == 43) {
      return " badge bg-light-subtle   text-body";
    } else if (id == 44) {
      return " badge bg-light-subtle   text-body";
    } else if (id == 45) {
      return " badge bg-warning-subtle   text-warning";
    } else if (id == 46) {
      return " badge bg-danger-subtle   text-danger";
    } else if (id == 47) {
      return " badge bg-light-subtle   text-body";
    } else if (id == 48) {
      return " badge bg-warning-subtle  text-warning";
    } else if (id == 49) {
      return " badge bg-danger-subtle   text-danger";
    } else if (id == 50) {
      return " badge bg-danger-subtle   text-danger";
    } else if (id == 51) {
      return " badge bg-info-subtle   text-info";
    } else if (id == 52) {
      return " badge bg-primary-subtle   text-primary";
    } else if (id == 53) {
      return " badge bg-warning-subtle   text-warning";
    } else if (id == 54) {
      return " badge bg-info-subtle   text-info";
    } else if (id == 55) {
      return " badge bg-warning-subtle   text-warning";
    } else if (id == 56) {
      return " badge bg-success-subtle   text-success";
    } else if (id == 57) {
      return " badge bg-danger-subtle   text-danger";
    } else if (id == 58) {
      return " badge bg-danger-subtle   text-danger";
    } else if (id == 59) {
      return " badge bg-danger-subtle   text-danger";
    } else if (id == 60) {
      return " badge bg-danger-subtle   text-danger";
    } else if (id == 61) {
      return " badge bg-danger-subtle   text-danger";
    } else if (id == 62) {
      return " badge bg-warning-subtle  text-warning";
    } else if (id == 63) {
      return " badge bg-success-subtle  text-success";
    } else if (id == 64) {
      return " badge bg-success-subtle  text-success";
    } else if (id == 65) {
      return " badge bg-warning-subtle  text-warning";
    } else if (id == 66) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 67) {
      return " badge bg-warning-subtle  text-warning";
    } else if (id == 68) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 69) {
      return " badge bg-danger-subtle  text-danger";
    } else if (id == 70) {
      return " badge bg-info-subtle  text-info";
    } else if (id == 71) {
      return " badge bg-warning-subtle  text-warning";
    } else if (id == 72) {
      return " badge bg-danger-subtle  text-danger";
    } else if (id == 73) {
      return " badge bg-warning-subtle  text-warning";
    }
    else if (id == 74) {
      return " badge bg-info-subtle  text-info";
    } else if (id == 75) {
      return " badge bg-success-subtle  text-success";
    } else if (id == 76) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 77) {
      return " badge bg-warning-subtle  text-warning";
    } else if (id == 78) {
      return " badge bg-warning-subtle  text-warning";
    } else if (id == 79) {
      return " badge bg-success-subtle  text-success";
    } else if (id == 79) {
      return " badge bg-success-subtle  text-success";
    } else if (id == 79) {
      return " badge bg-success-subtle  text-success";
    } else if (id == 80) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 81) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 82) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 83) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 84) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 85) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 86) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 87) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 88) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 89) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 90) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 91) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 92) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 93) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 94) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 95) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 96) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 97) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 98) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 99) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 100) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 101) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 102) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 103) {
      return " badge bg-warning-subtle  text-warning";
    } else if (id == 104) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 105) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 106) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 107) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 108) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 109) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 110) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 111) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 112) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 113) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 114) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 115) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 116) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 117) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 118) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 119) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 120) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 121) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 122) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 123) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 124) {
      return " badge bg-primary-subtle  text-primary";
    } else if (id == 125) {
      return " badge bg-primary-subtle  text-primary";
    }
  }

  returnWorkFlowStatusBadgeClasses(workflowStatusId: any) {
    if (workflowStatusId == 0) {
      return " badge bg-info";
    } else if (workflowStatusId == 1) {
      return " badge bg-danger";
    } else if (workflowStatusId == 2) {
      return " badge bg-warning ";
    } else if (workflowStatusId == 3) {
      return " badge bg-success";
    } else if (workflowStatusId == 4) {
      return " badge bg-danger ";
    } else if (workflowStatusId == 5) {
      return " badge bg-warning ";
    } else if (workflowStatusId == 6) {
      return " badge bg-danger ";
    } else if (workflowStatusId == 7) {
      return " badge bg-warning ";
    } else if (workflowStatusId == 8) {
      return " badge bg-danger";
    } else if (workflowStatusId == 9) {
      return " badge bg-danger ";
    } else if (workflowStatusId == 10) {
      return " badge bg-light text-dark";
    } else if (workflowStatusId == 11) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 12) {
      return " badge bg-secondary  ";
    } else if (workflowStatusId == 13) {
      return " badge bg-danger ";
    } else if (workflowStatusId == 14) {
      return " badge bg-light text-dark";
    } else if (workflowStatusId == 15) {
      return " badge bg-light text-dark";
    } else if (workflowStatusId == 16) {
      return " badge bg-danger ";
    } else if (workflowStatusId == 17) {
      return " badge bg-light text-dark";
    } else if (workflowStatusId == 18) {
      return " badge bg-light text-dark";
    } else if (workflowStatusId == 19) {
      return " badge bg-danger ";
    } else if (workflowStatusId == 20) {
      return " badge bg-light text-dark";
    } else if (workflowStatusId == 21) {
      return " badge bg-light text-dark";
    } else if (workflowStatusId == 22) {
      return " badge bg-light text-dark";
    } else if (workflowStatusId == 23) {
      return " badge bg-light text-dark";
    } else if (workflowStatusId == 24) {
      return " badge bg-success";
    } else if (workflowStatusId == 25) {
      return " badge bg-success";
    } else if (workflowStatusId == 26) {
      return " badge bg-success";
    } else if (workflowStatusId == 27) {
      return " badge bg-danger ";
    } else if (workflowStatusId == 28) {
      return " badge bg-success";
    } else if (workflowStatusId == 29) {
      return " badge bg-info";
    } else if (workflowStatusId == 30) {
      return " badge bg-info";
    } else if (workflowStatusId == 31) {
      return " badge bg-secondary ";
    } else if (workflowStatusId == 32) {
      return " badge bg-success";
    } else if (workflowStatusId == 33) {
      return " badge bg-light text-dark";
    } else if (workflowStatusId == 34) {
      return " badge bg-danger ";
    } else if (workflowStatusId == 35) {
      return " badge bg-success";
    } else if (workflowStatusId == 36) {
      return " badge bg-danger";
    } else if (workflowStatusId == 37) {
      return " badge bg-light text-dark";
    } else if (workflowStatusId == 38) {
      return " badge bg-danger ";
    } else if (workflowStatusId == 39) {
      return " badge bg-danger ";
    } else if (workflowStatusId == 40) {
      return " badge bg-light text-dark";
    } else if (workflowStatusId == 41) {
      return " badge bg-light text-dark";
    } else if (workflowStatusId == 42) {
      return " badge bg-warning text-warning";
    } else if (workflowStatusId == 43) {
      return " badge bg-light text-dark";
    } else if (workflowStatusId == 44) {
      return " badge bg-light text-dark";
    } else if (workflowStatusId == 45) {
      return " badge bg-warning ";
    } else if (workflowStatusId == 46) {
      return " badge bg-danger ";
    } else if (workflowStatusId == 47) {
      return " badge bg-light text-dark";
    } else if (workflowStatusId == 48) {
      return " badge bg-warning text-light";
    } else if (workflowStatusId == 49) {
      return " badge bg-danger ";
    } else if (workflowStatusId == 50) {
      return " badge bg-danger";
    } else if (workflowStatusId == 51) {
      return " badge bg-info  ";
    } else if (workflowStatusId == 52) {
      return " badge bg-primary";
    } else if (workflowStatusId == 53) {
      return " badge bg-warning";
    } else if (workflowStatusId == 54) {
      return " badge bg-info  ";
    } else if (workflowStatusId == 55) {
      return " badge bg-warning";
    } else if (workflowStatusId == 56) {
      return " badge bg-success  ";
    } else if (workflowStatusId == 57) {
      return " badge bg-danger";
    } else if (workflowStatusId == 58) {
      return " badge bg-danger";
    } else if (workflowStatusId == 59) {
      return " badge bg-danger";
    } else if (workflowStatusId == 60) {
      return " badge bg-danger";
    } else if (workflowStatusId == 61) {
      return " badge bg-danger";
    } else if (workflowStatusId == 62) {
      return " badge bg-warning";
    } else if (workflowStatusId == 63) {
      return " badge bg-success";
    } else if (workflowStatusId == 64) {
      return " badge bg-success";
    } else if (workflowStatusId == 65) {
      return " badge bg-warning";
    } else if (workflowStatusId == 66) {
      return " badge bg-primary";
    } else if (workflowStatusId == 67) {
      return " badge bg-warning";
    } else if (workflowStatusId == 68) {
      return " badge bg-primary";
    } else if (workflowStatusId == 69) {
      return " badge bg-danger";
    } else if (workflowStatusId == 70) {
      return " badge bg-info";
    } else if (workflowStatusId == 71) {
      return " badge bg-warning";
    } else if (workflowStatusId == 72) {
      return " badge bg-danger";
    } else if (workflowStatusId == 73) {
      return " badge bg-warning";
    }

    else if (workflowStatusId == 74) {
      return " badge bg-info ";
    } else if (workflowStatusId == 75) {
      return " badge bg-success  ";
    } else if (workflowStatusId == 76) {
      return " badge bg-primary  ";
    } else if (workflowStatusId == 77) {
      return " badge bg-warning  ";
    } else if (workflowStatusId == 78) {
      return " badge bg-warning  ";
    } else if (workflowStatusId == 79) {
      return " badge bg-success ";
    } else if (workflowStatusId == 80) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 81) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 82) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 83) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 84) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 85) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 86) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 87) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 88) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 90) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 91) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 92) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 93) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 94) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 95) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 96) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 97) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 98) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 99) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 100) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 101) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 102) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 103) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 104) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 105) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 106) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 107) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 108) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 109) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 110) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 111) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 112) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 113) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 114) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 115) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 116) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 117) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 118) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 119) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 120) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 121) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 122) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 123) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 124) {
      return " badge bg-primary ";
    } else if (workflowStatusId == 125) {
      return " badge bg-primary ";
    }
  }

  dateFormatter(date) {
    const newDate = moment(date).format("YYYY-MM-DD");
    if (newDate === "1970-01-01") return null;
    else return newDate;
  }

  returnAssetStatusBorderAndBadgeClasses(id: any) {
    if (id == 0) {
      return "info";
    } else if (id == 1) {
      return "danger";
    } else if (id == 2) {
      return "warning";
    } else if (id == 3) {
      return "success";
    } else if (id == 4) {
      return "danger";
    } else if (id == 5) {
      return "warning";
    } else if (id == 6) {
      return "danger";
    } else if (id == 7) {
      return "warning";
    } else if (id == 8) {
      return "danger";
    } else if (id == 9) {
      return "danger";
    } else if (id == 10) {
      return "light";
    } else if (id == 11) {
      return "primary";
    } else if (id == 12) {
      return "secondary";
    } else if (id == 13) {
      return "danger";
    } else if (id == 14) {
      return "light";
    } else if (id == 15) {
      return "light";
    } else if (id == 16) {
      return "danger";
    } else if (id == 17) {
      return "light";
    } else if (id == 18) {
      return "light";
    } else if (id == 19) {
      return "danger";
    } else if (id == 20) {
      return "light";
    } else if (id == 21) {
      return "light";
    } else if (id == 22) {
      return "light";
    } else if (id == 23) {
      return "light";
    } else if (id == 24) {
      return "success";
    } else if (id == 25) {
      return "success";
    } else if (id == 26) {
      return "success";
    } else if (id == 27) {
      return "danger";
    } else if (id == 28) {
      return "success";
    } else if (id == 29) {
      return "info";
    } else if (id == 30) {
      return "info";
    } else if (id == 31) {
      return "secondary";
    } else if (id == 32) {
      return "success";
    } else if (id == 33) {
      return "light";
    } else if (id == 34) {
      return "danger";
    } else if (id == 35) {
      return "success";
    } else if (id == 36) {
      return "danger";
    } else if (id == 37) {
      return "light";
    } else if (id == 38) {
      return "danger";
    } else if (id == 39) {
      return "danger";
    } else if (id == 40) {
      return "light";
    } else if (id == 41) {
      return "light";
    } else if (id == 42) {
      return "warning";
    } else if (id == 43) {
      return "light";
    } else if (id == 44) {
      return "light";
    } else if (id == 45) {
      return "warning";
    } else if (id == 46) {
      return "danger";
    } else if (id == 47) {
      return "light";
    } else if (id == 48) {
      return "warning";
    } else if (id == 49) {
      return "danger";
    } else if (id == 50) {
      return "danger";
    } else if (id == 51) {
      return "info";
    } else if (id == 52) {
      return "primary";
    } else if (id == 53) {
      return "warning";
    } else if (id == 54) {
      return "info";
    } else if (id == 55) {
      return "warning";
    } else if (id == 56) {
      return "success";
    } else if (id == 57) {
      return "danger";
    } else if (id == 58) {
      return "danger";
    } else if (id == 59) {
      return "danger";
    } else if (id == 60) {
      return "danger";
    } else if (id == 61) {
      return "danger";
    } else if (id == 62) {
      return "warning";
    } else if (id == 63) {
      return "success";
    } else if (id == 64) {
      return "success";
    } else if (id == 65) {
      return "warning";
    } else if (id == 66) {
      return "primary";
    } else if (id == 67) {
      return "warning";
    } else if (id == 68) {
      return "primary";
    } else if (id == 69) {
      return "danger";
    } else if (id == 70) {
      return "info";
    } else if (id == 71) {
      return "warning";
    } else if (id == 72) {
      return "danger";
    } else if (id == 73) {
      return "warning";
    }
    else if (id == 74) {
      return "info";
    } else if (id == 75) {
      return "success";
    } else if (id == 76) {
      return "primary";
    } else if (id == 77) {
      return "warning";
    } else if (id == 78) {
      return "warning";
    } else if (id == 79) {
      return "success";
    }
    else if (id == 80) {
      return "primary";
    } else if (id == 81) {
      return "primary";
    } else if (id == 82) {
      return "primary";
    } else if (id == 83) {
      return "primary";
    } else if (id == 84) {
      return "primary";
    } else if (id == 85) {
      return "primary";
    } else if (id == 86) {
      return "primary";
    } else if (id == 87) {
      return "primary";
    } else if (id == 88) {
      return "primary";
    } else if (id == 90) {
      return "primary";
    } else if (id == 91) {
      return "primary";
    } else if (id == 92) {
      return "primary";
    } else if (id == 93) {
      return "primary";
    } else if (id == 94) {
      return "primary";
    } else if (id == 95) {
      return "primary";
    } else if (id == 96) {
      return "primary";
    } else if (id == 97) {
      return "primary";
    } else if (id == 98) {
      return "primary";
    } else if (id == 99) {
      return "primary";
    } else if (id == 100) {
      return "primary";
    } else if (id == 101) {
      return "primary";
    } else if (id == 102) {
      return "primary";
    } else if (id == 103) {
      return "warning";
    } else if (id == 104) {
      return "primary";
    } else if (id == 105) {
      return "primary";
    } else if (id == 106) {
      return "primary";
    } else if (id == 107) {
      return "primary";
    } else if (id == 108) {
      return "primary";
    } else if (id == 109) {
      return "primary";
    } else if (id == 110) {
      return "primary";
    } else if (id == 111) {
      return "primary";
    } else if (id == 112) {
      return "primary";
    } else if (id == 113) {
      return "primary";
    } else if (id == 114) {
      return "primary";
    } else if (id == 115) {
      return "primary";
    } else if (id == 116) {
      return "primary";
    } else if (id == 117) {
      return "primary";
    } else if (id == 118) {
      return "primary";
    } else if (id == 119) {
      return "primary";
    } else if (id == 120) {
      return "primary";
    } else if (id == 121) {
      return "primary";
    } else if (id == 122) {
      return "primary";
    }else if (id == 123) {
      return "primary";
    }else if (id == 124) {
      return "primary";
    }else if (id == 125) {
      return "primary";
    }
  }


  formatDescription(description) {
    if (!description) return null;
    description = description.replace(/(?<!=")(https?:\/\/[^\s<]+)/gi, '<a href="$1" target="_blank">$1</a>');
    return description;
  }


  transform(html: string): SafeHtml {
    if (!html) return '';
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Add 'mb-0' class to all <p> elements
    const pElements = doc.querySelectorAll('p');
    pElements.forEach(p => p.classList.add('mb-0'));
  
    // Add 'img-fluid' class to all <img> elements and set max height/width
    const imgElements = doc.querySelectorAll('img');
    imgElements.forEach(img => {
      img.classList.add('img-fluid');
    //  img.style.maxHeight = '300px';
    //  img.style.maxWidth = '300px';
    });
  
    const newHtml = doc.body.innerHTML;
    return this.sanitizer.bypassSecurityTrustHtml(newHtml);
  }
  
  

  getStatusColor(status: string): string {


    switch (status) {
      case 'Available':
        return " bg-success-subtle  text-success";
      case 'Busy':
        return " bg-danger-subtle  text-danger";
      case 'Do not disturb':
        return " bg-danger-subtle  text-danger";
      case 'Be right back':
        return " bg-warning-subtle  text-warning";
      case 'Appear away':
        return " bg-warning-subtle  text-warning";
      case 'Appear offline':
        return " bg-dark-subtle  text-dark";
      case 'On Leave':
        return " bg-primary-subtle  text-primary";
      case 'Half Day':
        return " bg-secondary-subtle  text-secondary";
      default:
        return " bg-dark-subtle  text-dark";
    }
  }

  getStatusColorTop(status: string): string {


    switch (status) {
      case 'Available':
        return "   text-success";
      case 'Busy':
        return "   text-danger";
      case 'Do not disturb':
        return "   text-danger";
      case 'Be right back':
        return "   text-warning";
      case 'Appear away':
        return "   text-warning";
      case 'Appear offline':
        return "  text-dark";
      case 'On Leave':
        return "   text-primary";
      case 'Half Day':
        return "   text-secondary";
      default:
        return "  text-dark";
    }
  }

  getStatusColorCircle(status: string): string {

    switch (status) {
      case 'Available':
        return "bg-success bg-gradient";
      case 'Busy':
        return "bg-danger bg-gradient";
      case 'Do not disturb':
        return "bg-danger bg-gradient";
      case 'Be right back':
        return "bg-warning bg-gradient";
      case 'Appear away':
        return "bg-warning bg-gradient";
      case 'Appear offline':
        return "bg-dark-subtle";
      case 'On Leave':
        return "bg-primary bg-gradient";
      case 'Half Day':
        return "bg-secondary bg-gradient ";
      default:
        return "bg-body bg-gradient";
    }
  }
  getHoursAndMinutesDifference(targetDateString) {
    // Parse the target date string
    const timeData = targetDateString.split(' ').filter(item => item !== "").join(' ');

    // Parse the cleaned date string
    const targetDate = parse(timeData, 'MMM d yyyy h:mma', new Date());
    const currentDate = new Date();

    if (isNaN(targetDate.getTime())) {
      return 'Invalid date';
    }

    // Calculate the absolute difference in milliseconds
    const differenceInMs = Math.abs(currentDate.getTime() - targetDate.getTime());

    // Convert milliseconds to total seconds
    const differenceInSeconds = Math.floor(differenceInMs / 1000);

    // Convert total seconds to total minutes and remaining seconds
    const totalMinutes = Math.floor(differenceInSeconds / 60);
    const remainingSeconds = differenceInSeconds % 60;

    // Convert total minutes to total hours and remaining minutes
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    return `${totalHours} hrs : ${remainingMinutes} min : ${remainingSeconds} sec`;
  }


  processDocUrls(data) {
    const paths = [
      "\\MaintenanceAgreement\\Uploads\\",
      "\\ProjectWarrenty\\Uploads\\"
    ];

    // Remove base paths
    paths.forEach(basePath => {
      const regex = new RegExp(basePath.replace(/\\/g, '\\\\'), 'g');
      data = data.replace(regex, '');
    });

    // Split the path by the delimiter
    const parts = data.split('\\');

    // Return the last part (file name) and the desired part (second-to-last if it exists)
    const lastPart = parts.pop();  // The file name
    const secondLastPart = parts.length ? parts.pop() : '';  // The part before the file name
    let results = { fileName: lastPart, additionalPart: secondLastPart };
    return results.fileName

  }
}

