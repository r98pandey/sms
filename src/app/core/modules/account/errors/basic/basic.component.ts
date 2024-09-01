import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: "app-basic",
  templateUrl: "./basic.component.html",
  styleUrls: ["./basic.component.scss"],
})

/**
 * 404 Basic Component
 */
export class BasicComponent implements OnInit {
  // set the current year
  year: number = new Date().getFullYear();

  constructor(private router: Router) {}

  ngOnInit(): void {}

  backtoHome() {
    let data: any = JSON.parse(localStorage.getItem("currentUser"));
    if (data?.role === "Client User") {
      if (data?.accessGroupName === "Application User") {
        this.router.navigate([
          "maintenance-management/corrective/ticket/list-ticket",
        ]);
      } else {
        this.router.navigate([
          "/maintenance-management/dashboard/client-dashboard",
        ]);
      }
    } else if (data?.role === "Help Desk") {
      this.router.navigate([
        "/maintenance-management/dashboard/help-desk-dashboard",
      ]);
    } else if (data?.role === "Asset Administrator") {
      this.router.navigate([
        "/maintenance-management/dashboard/asset-dashboard",
      ]);
    } else {
      this.router.navigate(["/"]);
    }
  }
}
