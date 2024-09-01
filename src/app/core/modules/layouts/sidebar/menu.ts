import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: "Human Resource",
    isTitle: true,
  },
  {
    id: 1.1,
    label: "Human Resource",
    icon: "las  ri-shield-user-line",
    subItems: [
      {
        id: 111,
        label: "Dashboard",
        icon: "las ri-home-smile-line",
        link: "/human-resource/dashboard-human-resource",
      }, {
        id: 112,
        label: "Employee Profile",
        icon: "las ri-home-smile-line",
        link: "/application-settings/user-management/user/employee-profile-list",
      }, {
        id: 113,
        label: "Attendance",
        icon: "las ri-home-smile-line",
        link: "/maintenance-management/attendance/daily-attendance",
      }]
  },

  //2
  {
    id: 2,
    label: "ASSET MANAGEMENT",
    isTitle: true,
  },
  {
    id: 2.1,
    label: "Asset Management",
    icon: "las ri-server-line",
    subItems: [
      {
        id: 211,
        label: "Dashboard",

        link: "/maintenance-management/dashboard/asset-dashboard",
      },
      {
        id: 212,
        label: "Asset List",

        link: "/asset-management/asset/listasset",
      },
      {
        id: 213,
        label: "Spare Part",

        link: "/asset-management/spare/list-spare",
      },
      {
        id: 215,
        label: "Audit",
        link: "/asset-management/audit-management/audit/listaudit",

      },
      {
        id: 214,
        label: "Delivery",

        link: "/asset-management/delivery-note/list-delivery",
      },
      {
        id: 216,
        label: "Disposable",

        link: "/asset-management/disposable/list-disposable",

      },

      {
        id: 215,
        label: "Setup",
        icon: "ri-hand-coin-line",
        subItems: [
          {
            id: 2151,
            label: "Asset Handler",
            link: "/application-settings/asset-handler/asset-handler-list",
            parentId: 215,
          },
          {
            id: 2152,
            label: "Asset Category",
            link: "/application-settings/asset-setup/category",
            parentId: 215,
          },
          {
            id: 2153,
            label: "Asset Sub Category",
            link: "/application-settings/asset-setup/sub-category",
            parentId: 215,
          },
          {
            id: 2154,
            label: "Location",
            link: "/application-settings/location/location-list",
            parentId: 215,
          },
          {
            id: 2156,
            label: "Vendor",
            link: "/application-settings/vendor",
            parentId: 215,
          },
        ],
      },

    ]

  },

  //3
  {
    id: 3,
    label: "Project Management",
    isTitle: true,
  },

  {
    id: 3.1,
    label: "Project Management",
    icon: "ri-archive-drawer-fill",
    subItems: [

      {
        id: 311,
        label: "Analytical Dashboard",
        icon: "las ri-home-smile-line",
        link: "/project-management/dashboard/project-dashboard",
      },
      {
        id: 312,
        label: "Progress Dashboard",
        icon: "las ri-home-smile-line",
        link: "/project-management/dashboard/progress-update-dashboard",
      },  {
        id: 313,
        label: "Management Dashboard",
        icon: "las ri-home-smile-line",
        link: "/project-management/dashboard/management-dashboard",
      }, {
        id: 314,
        label: "My Task",
        icon: "las ri-home-smile-line",
        link: "/project-management/my-task/my-task-list",
      },

      {
        id: 315,
        label: "Stakeholder",
        subItems: [
          {
            id: 3151,
            label: "Client",
            icon: "las bx bx-user-pin",
            link: "/application-settings/pm-client/pm-client-list",
            parentId: 314,
          },{
            id: 3152,
            label: "Prospect",
            icon: "las bx bx-user-pin",
            link: "/application-settings/pm-client/pm-prospect-list",
            parentId: 314,
          }, {
            id: 3153,
            label: "My Project",
            icon: "las la-project-diagram",
            link: "/project-management/project-setup/list-project",
            parentId: 314,
          },
        ]
      },
      {
        id: 316,
        label: "Task Schedule",
        icon: "ri-archive-drawer-fill",
        link: "/project-management/task-setup/project-schedule-list",
      },{
        id: 317,
        label: "Work Programme",
        icon: "ri-archive-drawer-fill",
        link: "/project-management/work-progress/work-progress-list",
      },

      
    ]


  },

  //4 

  {
    id: 4,
    label: "Maintenance Management",
    isTitle: true,
  },
  {
    id: 4.1,
    label: "Maintenance ",
    icon: "ri-database-2-line",
    subItems: [
      {
        id: 411,
        label: "Dashboard",
        subItems: [
          {
            id: 4111,
            label: "Operation",
            link: "/maintenance-management/dashboard/help-desk-dashboard",
            parentId: 411,
          },
          {
            id: 4112,
            label: "Client",
            link: "/maintenance-management/dashboard/client-dashboard",
            parentId: 411,
          }, {
            id: 4113,
            label: "Task Working Hours",
            link: "/maintenance-management/attendance/last-time-attendance",
            parentId: 411,
          },
        ]
      },
      {
        id: 412,
        label: "My Task",
        link: "/software-support/software-dashboard",

      }, {
        id: 413,
        label: "My Ticket",
        link: "/maintenance-management/dashboard/my-ticket",

      },
      {
        id: 414,
        label: "Corrective",
        subItems: [
          {
            id: 4141,
            label: "Ticket",
            link: "/maintenance-management/corrective/ticket/list-ticket",
            parentId: 414,
          },
          {
            id: 4142,
            label: "Service",
            link: "/maintenance-management/corrective/service-order/list-service-order",
            parentId: 414,
          },
          {
            id: 4143,
            label: "Quotation",
            link: "/maintenance-management/corrective/quotation/list-quotation",
            parentId: 414,
          },
        ]
      },

      {
        id: 415,
        label: "Preventive",
        subItems: [
          {
            id: 4151,
            label: "Configuration",
            link: "/maintenance-management/preventive/configuration/list-configuration",
            parentId: 415,
          },
          {
            id: 4152,
            label: "Schedule",
            link: "/maintenance-management/preventive/schedule/list-schedule",
            parentId: 415,
          },
          {
            id: 4153,
            label: "Verification ",
            link: "/maintenance-management/preventive/schedule-verification/list-schedule-verification",
            parentId: 415,
          }
        ],
      },

      {
        id: 9,
        label: "Setup",
        icon: "ri-hand-coin-line",
        subItems: [
          {
            id: 707,
            label: "Ticket Type",
            link: "/application-settings/maintenance-setup/ticket-type/ticket-type-list",
            parentId: 9,
          },
          {
            id: 705,
            label: "Prevention Checklist Category",
            link: "/application-settings/maintenance-setup/check-list-category/check-list-category-list",
            parentId: 9,
          },
          {
            id: 706,
            label: "Prevention Checklist Item",
            link: "/application-settings/maintenance-setup/check-list-type/check-list-type-list",
            parentId: 9,
          },
        ],
      },
    ]
  },

  //5

  {
    id: 5,
    label: " Setup Wizard",
    isTitle: true,
  },

  {
    id: 5.1,
    label: " Setup Wizard",
    icon: "ri-chat-settings-fill",
    subItems: [

      {
        id: 511,
        label: "Organization",
        icon: "las ri-home-smile-line",
        link: "/application-settings/company/company-list",
      },

      {
        id: 512,
        label: "Access Group",
        link: "/application-settings/access-group/access-group-list",

      },
      {
        id: 513,
        label: "Workflow",
        link: "/application-settings/workflow-setup/listworkflow",

      },

      {
        id: 514,
        label: "User Management",
        subItems: [

          {
            id: 5141,
            label: "Staff",
            link: "/application-settings/user-management/user/list",

          },
          {
            id: 5142,
            label: "External",
            link: "/application-settings/user-management/client-user/list",

          },

        ],
      },
    ],
  },

]
