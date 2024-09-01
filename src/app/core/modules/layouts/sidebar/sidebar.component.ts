import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

import { MENU } from "./menu";
import { MenuItem } from "./menu.model";
import { AuthAssetService } from "src/app/core/services/auth-asset.service";
import { MenuServiceService } from "src/app/core/services/menu-service.service";
import { map } from "rxjs";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  menu: any;
  toggle: any = true;
  menuItems: MenuItem[] = [];
  @ViewChild("sideMenu") sideMenu!: ElementRef;
  @Output() mobileMenuButtonClicked = new EventEmitter();

  constructor(
    private router: Router,
    public translate: TranslateService,
    public authAssetService: AuthAssetService,
    public menuService: MenuServiceService
  ) {
    translate.setDefaultLang("en");
  }

  ngOnInit(): void {
    // Menu Items
    this.getAccessGroupMenuSubMenu();
  }

  /***
   * Activate droup down set
   */
  ngAfterViewInit() {
    this.initActiveMenu();
    this.toggleMobileMenu();
  }

  removeActivation(items: any) {
    items.forEach((item: any) => {
      if (item.classList.contains("menu-link")) {
        if (!item.classList.contains("active")) {
          item.setAttribute("aria-expanded", false);
        }
        item.nextElementSibling
          ? item.nextElementSibling.classList.remove("show")
          : null;
      }
      if (item.classList.contains("nav-link")) {
        if (item.nextElementSibling) {
          item.nextElementSibling.classList.remove("show");
        }
        item.setAttribute("aria-expanded", false);
      }
      item.classList.remove("active");
    });
  }

  toggleSubItem(event: any) {
    let isCurrentMenuId = event.target.closest("a.nav-link");
    let isMenu = isCurrentMenuId.nextElementSibling as any;
    if (isMenu.classList.contains("show")) {
      isMenu.classList.remove("show");
      isCurrentMenuId.setAttribute("aria-expanded", "false");
    } else {
      let dropDowns = Array.from(document.querySelectorAll(".sub-menu"));
      dropDowns.forEach((node: any) => {
        node.classList.remove("show");
      });

      let subDropDowns = Array.from(
        document.querySelectorAll(".menu-dropdown .nav-link")
      );
      subDropDowns.forEach((submenu: any) => {
        submenu.setAttribute("aria-expanded", "false");
      });

      if (event.target && event.target.nextElementSibling) {
        isCurrentMenuId.setAttribute("aria-expanded", "true");
        event.target.nextElementSibling.classList.toggle("show");
      }
    }
  }

  toggleExtraSubItem(event: any) {
    let isCurrentMenuId = event.target.closest("a.nav-link");
    let isMenu = isCurrentMenuId.nextElementSibling as any;
    if (isMenu.classList.contains("show")) {
      isMenu.classList.remove("show");
      isCurrentMenuId.setAttribute("aria-expanded", "false");
    } else {
      let dropDowns = Array.from(document.querySelectorAll(".extra-sub-menu"));
      dropDowns.forEach((node: any) => {
        node.classList.remove("show");
      });

      let subDropDowns = Array.from(
        document.querySelectorAll(".menu-dropdown .nav-link")
      );
      subDropDowns.forEach((submenu: any) => {
        submenu.setAttribute("aria-expanded", "false");
      });

      if (event.target && event.target.nextElementSibling) {
        isCurrentMenuId.setAttribute("aria-expanded", "true");
        event.target.nextElementSibling.classList.toggle("show");
      }
    }
  }

  // Click wise Parent active class add
  toggleParentItem(event: any) {
    let isCurrentMenuId = event.target.closest("a.nav-link");
    let dropDowns = Array.from(document.querySelectorAll("#navbar-nav .show"));
    dropDowns.forEach((node: any) => {
      node.classList.remove("show");
    });
    const ul = document.getElementById("navbar-nav");
    if (ul) {
      const iconItems = Array.from(ul.getElementsByTagName("a"));
      let activeIconItems = iconItems.filter((x: any) =>
        x.classList.contains("active")
      );
      activeIconItems.forEach((item: any) => {
        item.setAttribute("aria-expanded", "false");
        item.classList.remove("active");
      });
    }
    isCurrentMenuId.setAttribute("aria-expanded", "true");
    if (isCurrentMenuId) {
      this.activateParentDropdown(isCurrentMenuId);
    }
  }

  toggleItem(event: any) {
    let isCurrentMenuId = event.target.closest("a.nav-link");
    let isMenu = isCurrentMenuId.nextElementSibling as any;
    if (isMenu.classList.contains("show")) {
      isMenu.classList.remove("show");
      isCurrentMenuId.setAttribute("aria-expanded", "false");
    } else {
      let dropDowns = Array.from(
        document.querySelectorAll("#navbar-nav .show")
      );
      dropDowns.forEach((node: any) => {
        node.classList.remove("show");
      });
      isMenu ? isMenu.classList.add("show") : null;
      const ul = document.getElementById("navbar-nav");
      if (ul) {
        const iconItems = Array.from(ul.getElementsByTagName("a"));
        let activeIconItems = iconItems.filter((x: any) =>
          x.classList.contains("active")
        );
        activeIconItems.forEach((item: any) => {
          item.setAttribute("aria-expanded", "false");
          item.classList.remove("active");
        });
      }
      isCurrentMenuId.setAttribute("aria-expanded", "true");
      if (isCurrentMenuId) {
        this.activateParentDropdown(isCurrentMenuId);
      }
    }
  }

  // remove active items of two-column-menu
  activateParentDropdown(item: any) {
    item.classList.add("active");
    let parentCollapseDiv = item.closest(".collapse.menu-dropdown");

    if (parentCollapseDiv) {
      // to set aria expand true remaining
      parentCollapseDiv.classList.add("show");
      parentCollapseDiv.parentElement.children[0].classList.add("active");
      parentCollapseDiv.parentElement.children[0].setAttribute(
        "aria-expanded",
        "true"
      );
      if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
        parentCollapseDiv.parentElement
          .closest(".collapse")
          .classList.add("show");
        if (
          parentCollapseDiv.parentElement.closest(".collapse")
            .previousElementSibling
        )
          parentCollapseDiv.parentElement
            .closest(".collapse")
            .previousElementSibling.classList.add("active");
        if (
          parentCollapseDiv.parentElement
            .closest(".collapse")
            .previousElementSibling.closest(".collapse")
        ) {
          parentCollapseDiv.parentElement
            .closest(".collapse")
            .previousElementSibling.closest(".collapse")
            .classList.add("show");
          parentCollapseDiv.parentElement
            .closest(".collapse")
            .previousElementSibling.closest(".collapse")
            .previousElementSibling.classList.add("active");
        }
      }
      return false;
    }
    return false;
  }

  updateActive(event: any) {
    const ul = document.getElementById("navbar-nav");
    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      this.removeActivation(items);
    }
    this.activateParentDropdown(event.target);
  }

  initActiveMenu() {
    document.documentElement.setAttribute(
      "data-sidebar-size",
      "sm-hover-active"
    );
    const pathName = window.location.pathname;
    const ul = document.getElementById("navbar-nav");
    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      let activeItems = items.filter((x: any) =>
        x.classList.contains("active")
      );
      this.removeActivation(activeItems);

      let matchingMenuItem = items.find((x: any) => {
        return x.pathname === pathName;
      });
      if (matchingMenuItem) {
        this.activateParentDropdown(matchingMenuItem);
      }
    }
  }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu() {
    var sidebarsize =
      document.documentElement.getAttribute("data-sidebar-size");
    if (sidebarsize == "sm-hover-active") {
      document.documentElement.setAttribute("data-sidebar-size", "sm-hover");
    } else {
      document.documentElement.setAttribute(
        "data-sidebar-size",
        "sm-hover-active"
      );
    }
  }

  /**
   * SidebarHide modal
   * @param content modal content
   */
  SidebarHide() {
    document.body.classList.remove("vertical-sidebar-enable");
  }
  getAccessGroupMenuSubMenu() {
     this.menuItems = MENU; /// when we reqired access so this ine comment and below uncommit
    
    
     let isSuperAdmin =
      String(this.authAssetService.getRole()).trim().toLocaleLowerCase() ===
      String("Super Admin").trim().toLocaleLowerCase();
     if (isSuperAdmin) {
      this.menuItems = MENU;
    } else {
      this.menuService.getAccessGroupMenuSubMenu().subscribe(
        (res: any) => {
          localStorage.setItem("menuItems", JSON.stringify(res.data));
          this.menuItems = this.maketheObject(res.data);
          // this.menuItems = <MenuItem[]>JSON.parse(JSON.stringify(res.data));
        },
        (err) => {
          // //console.log(err);
        }
      );
    }
  }

  maketheObject(res: any) {
    let returObject = [];

    const applicationSetup = res.find(
      (obj) => obj.solutionName === "User Management"
    );

    if (applicationSetup) {
      returObject.push(
        {
          label: "User Management",
          isTitle: true,
        },
        {
          label: "User Management",
          icon: "las ri-briefcase-line",
          subItems: res
            .filter(
              (element) =>
                element.solutionName === "User Management" &&
                element.isTitle == false
            )
            .map((element) => {
              return {
                label: element.label,
                icon: element.icon,
                link: element.link ? element.link : null,
                subItems: element.subMenuList ? element.subMenuList : [],
              };
            }),
        }
      );
    }


    
    const HumanResource = res.find(
      (obj) => obj.solutionName === "Human Resource"
    );

    if (HumanResource) {
      returObject.push(
        {
          id: 1,
          label: "Human Resource",
          isTitle: true,
        },
        {
          id: 2,
          label: "Human Resource",
          icon: "las ri-shield-user-line",
          subItems: res
            .filter(
              (element) =>
                element.solutionName === "Human Resource" &&
                element.isTitle == false
            )
            .map((element) => {
              return {
                label: element.label,
                icon: element.icon,
                link: element.link ? element.link : null,
                subItems: element.subMenuList ? element.subMenuList : [],
              };
            }),
        }
      );
    }

    const assetManagement = res.find(
      (obj) => obj.solutionName === "Asset Management"
    );

    if (assetManagement) {
      returObject.push(
        {
          id: 1,
          label: "ASSET MANAGEMENT",
          isTitle: true,
        },
        {
          id: 2,
          label: "Asset Management",
          icon: "las ri-server-line",
          subItems: res
            .filter(
              (element) =>
                element.solutionName === "Asset Management" &&
                element.isTitle == false
            )
            .map((element) => {
              return {
                label: element.label,
                icon: element.icon,
                link: element.link ? element.link : null,
                subItems: element.subMenuList ? element.subMenuList : [],
              };
            }),
        }
      );
    }



    const ProjectManagement = res.find(
      (obj) => obj.solutionName === "Project Management"
    );

    if (ProjectManagement) {
      returObject.push(
        {
          label: "Project Management",
          isTitle: true,
        },
        {
          label: "Project Management",
          icon: "ri-archive-drawer-fill",
          subItems: res
            .filter(
              (element) =>
                element.solutionName === "Project Management" &&
                element.isTitle == false
            )
            .map((element) => {
              return {
                label: element.label,
                icon: element.icon,
                link: element.link ? element.link : null,
                subItems: element.subMenuList ? element.subMenuList : [],
              };
            }),
        }
      );
    }


    const maintenanceManagement = res.find(
      (obj) => obj.solutionName === "Maintenance Management"
    );

    if (maintenanceManagement) {
      returObject.push(
        {
          label: "Maintenance Management",
          isTitle: true,
        },
        {
          label: "Maintenance",
          icon: "ri-database-2-line",
          subItems: res
            .filter(
              (element) =>
                element.solutionName === "Maintenance Management" &&
                element.isTitle == false
            )
            .map((element) => {
              return {
                label: element.label,
                icon: element.icon,
                link: element.link ? element.link : null,
                subItems: element.subMenuList ? element.subMenuList : [],
              };
            }),
        }
      );
    }
    

    const AttendanceManagement = res.find(
      (obj) => obj.solutionName === "Attendance Management"
    );

    if (AttendanceManagement) {
      returObject.push(
        {
          label: "Attendance Management",
          isTitle: true,
        },
        {
          label: "Attendance",
          icon: "ri-database-2-line",
          subItems: res
            .filter(
              (element) =>
                element.solutionName === "Attendance Management" &&
                element.isTitle == false
            )
            .map((element) => {
              return {
                label: element.label,
                icon: element.icon,
                link: element.link ? element.link : null,
                subItems: element.subMenuList ? element.subMenuList : [],
              };
            }),
        }
      );
    }


    const documentManagement = res.find(
      (obj) => obj.solutionName === "Document Management"
    );

    if (documentManagement) {
      returObject.push(
        {
          label: "Document Management",
          isTitle: true,
        },
        {
          label: "Document",
          icon: " ri-file-3-line",
          subItems: res
            .filter(
              (element) =>
                element.solutionName === "Document Management" &&
                element.isTitle == false
            )
            .map((element) => {
              return {
                label: element.label,
                icon: element.icon,
                link: element.link ? element.link : null,
                subItems: element.subMenuList ? element.subMenuList : [],
              };
            }),
        }
      );
    }

    const buildingManagement = res.find(
      (obj) => obj.solutionName === "Building Management"
    );

    if (buildingManagement) {
      returObject.push(
        {
          label: "Building Management",
          isTitle: true,
        },
        {
          label: "Building",
          icon: " ri-building-2-line",
          subItems: res
            .filter(
              (element) =>
                element.solutionName === "Building Management" &&
                element.isTitle == false
            )
            .map((element) => {
              return {
                label: element.label,
                icon: element.icon,
                link: element.link ? element.link : null,
                subItems: element.subMenuList ? element.subMenuList : [],
              };
            }),
        }
      );
    }

    const reportCenter = res.find(
      (obj) => obj.solutionName === "Report Center"
    );

    if (reportCenter) {
      returObject.push(
        {
          label: "Report Center",
          isTitle: true,
        },
        {
          label: "Report Center",
          icon: " ri-git-repository-commits-line",
          subItems: res
            .filter(
              (element) =>
                element.solutionName === "Report Center" &&
                element.isTitle == false
            )
            .map((element) => {
              return {
                label: element.label,
                icon: element.icon,
                link: element.link ? element.link : null,
                subItems: element.subMenuList ? element.subMenuList : [],
              };
            }),
        }
      );
    }

    const setupWizard = res.find((obj) => obj.solutionName === "Setup Wizard");

    if (setupWizard) {
      returObject.push(
        {
          label: "Setup Wizard",
          isTitle: true,
        },
        {
          label: "Setup Wizard",
          icon: " ri-chat-settings-fill",
          subItems: res
            .filter(
              (element) =>
                element.solutionName === "Setup Wizard" &&
                element.isTitle == false
            )
            .map((element) => {
              return {
                label: element.label,
                icon: element.icon,
                link: element.link ? element.link : null,
                subItems: element.subMenuList ? element.subMenuList : [],
              };
            }),
        }
      );
    }

    return returObject;
  }

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
