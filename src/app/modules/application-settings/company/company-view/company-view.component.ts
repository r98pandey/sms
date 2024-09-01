import { CompanyService } from "src/app/core/services/company.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "src/environments/environment.prod";
@Component({
  selector: "app-company-view",
  templateUrl: "./company-view.component.html",
  styleUrls: ["./company-view.component.scss"],
})
export class CompanyViewComponent implements OnInit {
  companyId: any = null;
  companyData: any = [];
  baseUrl: any;
  companyLogoImg: any;
  default_Lago_Img: any;
  imageUrl: any;

  label: any = "Company";
  breadCrumbItems: any = [
    { label: "Company" },
    { label: "Company Detail", active: true },
  ];
  constructor(
    private companyService: CompanyService,
    private actvatedroute: ActivatedRoute,
    private router: Router
  ) {
    this.imageUrl = environment.apiUrl;
  }

  ngOnInit(): void {
    this.baseUrl = environment.apiUrl;
    this.actvatedroute.params.subscribe((params) => {
      this.companyId = params["id"];
      if (this.companyId) {
        let payload: any = {};
        payload.companyId = Number(this.companyId);
        this.getViewData(payload);
      }
    });
  }

  getViewData(paylod: any) {
    this.companyService.getCompanyDetail(paylod).subscribe((res: any) => {
      //console.log(res);
      this.companyData = res?.data;
      if (
        this.companyData.companyLogoURL === " " ||
        this.companyData.companyLogoURL === null ||
        this.companyData.companyLogoURL === "undefined"
      ) {
        this.companyLogoImg = this.default_Lago_Img =
          "../../../../../assets/images/placeholderimage.png";
      } else {
        this.companyLogoImg = environment.apiUrl + res?.data?.companyLogoURL;
      }
    });
  }

  goBack() {
    this.router.navigate(["/application-settings/company/company-list"]);
  }

  toUpperCaseword(data: string) {
    if(data) return data.toUpperCase();
    return "";
  }
}
