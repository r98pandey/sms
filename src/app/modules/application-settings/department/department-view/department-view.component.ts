import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { DepartmentService } from "src/app/core/services/department.service";

@Component({
  selector: "app-department-view",
  templateUrl: "./department-view.component.html",
  styleUrls: ["./department-view.component.scss"],
})
export class DepartmentViewComponent {
  label: any = "Department Detail";
  breadCrumbItems: any = [
    { label: "Department" },
    { label: "Department Detail", active: true },
  ];

  dDetail: any = {};
  departmentProjectLabel: string = "";

  constructor(
    private departmentService: DepartmentService,
    private authService: AuthAssetService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.departmentProjectLabel = this.authService.getisProject()
      ? "Project"
      : "Department";

      this.label = `${this.departmentProjectLabel} Detail`;
      this.breadCrumbItems = [
        { label: `${this.departmentProjectLabel}` },
        { label: `${this.departmentProjectLabel} Detail`, active: true },
      ];

    const departmentId = DepartmentService.editDepartmentId;
    if (departmentId == 0) {
      this.router.navigate(["/application-settings/department/project-list"]);
    } else {
      this.getDepartmentDetail(departmentId);
    }
  }

  getDepartmentDetail(departmentId) {
    this.departmentService.getDepartmentDetail(departmentId).subscribe({
      next: (res: any) => {
        this.dDetail = res.data;
      },
    });
  }

  toUpperCaseword(data: string) {
    if (data) return data.toUpperCase();
    return "";
  }

  goBack() {
    this.router.navigate(["/application-settings/department/project-list"]);
  }
}
