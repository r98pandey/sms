
export interface ProjectAdHocAndMaintenanceCount {
    projectAdhocCount: number;
    projectMaintenanceCount: number;
  }
  
  export interface ProjectProfileStatus {
    projectStatus: string;
    count: number;
  }
  
  export interface ProjectManagementActivityStatus {
    totalProject: number;
    totalAdHocProject: number;
    totalMaintenanceProject: number;
    totalProjectInitiated: number;
    totalProjectInProgress: number;
    totalProjectCompleted: number;
    totalProjectVerificationRequired: number;
    totalProjectAcknowledgementRequired: number;
    totalProjectPendingApproval: number;
  }
  
  export interface ClientStatus {
    totalClientProspect: number | null;
    totalClientActive: number | null;
    totalClientInactive: number | null;
    totalClientDeleted: number | null;
  }
  
  export interface DataModel {
    dataProjectAdHocAndMaintenanceCount: ProjectAdHocAndMaintenanceCount;
    dataProjectProfileStatusList: ProjectProfileStatus[];
    dataProjectManagementActivityStatusList: ProjectManagementActivityStatus;
    dataClientStatus: ClientStatus;
  }
  