export interface CreateTicket {
    mX_Ticketing: {
        IssueType: string,
        TicketTitle: string,
        IssueDescription: string,
        CompanyId: number,
        CompanyName: string,
        ProjectId: number,
        ProjectName: string,
        TicketTypeId: number,
        TicketTypeName: string,
        urgencyTypeId: number,
        urgencyTypeName: string,
        SupportType: string,
        IsWorkOrderGenerate: boolean,
        IsTechCreated: boolean,
        IsBillingRequired: boolean,
        Pic1_URLBase64?: string,
        Pic2_URLBase64?: string,
        AddtionalNote: string,
        // WOName: string,
        ExpWrkStartDate?: string,
        ExpWrkStartTime?: string
        OperationType: string,
        IncidentId?: string
        Remark_Pic1?: string,
        Remark_Pic2?: string,

    },
    mX_TicketItem: any[],
    mX_WOTechAssignment: any[]
}

export interface GenerateWorkOrder {
  mX_WorkOder: {
    // WOName: string,
    TicketId: string;
    TicketTypeId: string;
    TicketTypeName: string;
    UrgencyTypeId: string;
    UrgencyTypeName: string;
    IsBillingRequired: boolean;
    ExpWrkStartDate?: string;
    ExpWrkStartTime?: string;
    ExpectedComplitionDateTime?: String;
    AddtionalNote: string;
    isDeviceRelated: boolean;
    OperationType: string;
    SupportType: string;
  };
  mX_WOTechAssignment: any[];
}

export interface PreventiveMaintenanceCategory {
    CompanyId?: Number,
    PreventiveCategoryName?: string,
}

export interface MasterTicketInterface {
    TicketTypeName: string,
    IsDeviceRelated: boolean,
    TicketTypeId?: string,
}

export interface MasterTicketTypeInterface {
    TiketTypeId?: string,
    TiketTypeIssueDetail: string,
    TiketTypeIssueDetailId?: string,
}

export interface spareListInterface {
    displayLength: number,
    displayStart: number,
    companyId: string,
    SearchCatName?: string,
    SearchSubCatName?: string,
    SearchSparePartName?: string,
    SearchSparePartStatusId?: number,
}

export interface updateAsset {
    TicketItemId: string | number,
    TicketItemStatusId: string | number,
    TicketItemStatusName: string,
    TechnitionRemark: string,
    TechIMGURL1Base64?: string,
    TechIMGURL2Base64?: string,
    TechIMGURL3Base64?: string
}

export interface preventiveType {
    displayLength: number,
    displayStart: number,
    SearchCompanyId: number | string,
    PreventiveCategoryId: number | string,
    SearchPreventiveTypeName?: string
}