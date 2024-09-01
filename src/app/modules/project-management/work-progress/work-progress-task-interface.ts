export interface TaskDetail {
  projectTaskId: number;
  projectScheduleId: number;
  projectScheduleNo:string; // Changed from string to number to match the object
  companyId: number;
  companyName: string;
  clientId: number;
  clientName: string;
  projectId: number;
  projectName: string;
  taskTitle: string;
  taskNo: string;
  description: string;
  startDate: string;
  endDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  projectOwnerId: string;
  projectOwnerName: string;
  projectOwnerDesig: string;
  projectTaskStatusId: number;
  projectTaskStatusName: string;
  verifiedById?: string | null;
  verifiedBy?: string | null;
  verifiedDateTime?: string | null;
  verifiedRemark?: string | null;
  verifiedDesig?: string | null;
  acknowledgeById?: string | null;
  acknowledgeBy?: string | null;
  acknowledgeDateTime?: string | null;
  acknowledgeRemark?: string | null;
  acknowledgeDesig?: string | null;
  closedById?: string | null;
  closedBy?: string | null;
  closedDateTime?: string | null;
  closedRemark?: string | null;
  closedDesig?: string | null;
  createdById: string;
  createdBy: string;
  createdDate: string;
  totalWorkForceGroup: number;
  totalWorkingHours: number;
  totalSubTask: number;
  totalSubTaskCompleted: number;
  taskDuration?: string | null; // Added as it's in the object
  startedByName: string | null;
  startedByDesignation: string | null;
  endedByName?: string | null; // Added as it's in the object
  endedByDesignation?: string | null; // Added as it's in the object
  isUpdateButton: boolean; // Added as it's in the object
}


export interface SubTask {
  projectSubTaskId: number;
  projectTaskId: number;
  projectScheduleId: number;
  projectId: number;
  subTaskTitle: string;
  description: string;
  startDate: string;
  endDate: string;
  actualStartDate: string | null;
  actualEndDate: string | null;
  projectSubTaskStatusId: number;
  projectSubTaskStatusName: string;
  totalChildTask: number;
  totalSubTaskCompleted: number;
  subTaskNo: string
}

export interface SubTaskCount {
  totalSubTaskCount: number;
  totalSubTaskDraftCount: number;
  totalSubTaskNotStartCount: number;
  totalSubTaskInProgressCount: number;
  totalSubTaskVerificationCount: number;
  totalSubTaskAcknowledgementCount: number;
  totalSubTaskDoneCount: number;
}


export interface ProjectSchedule {
  projectScheduleId: number;
  projectScheduleName: string;
  companyId: number;
  companyName: string;
  clientId: number;
  clientName: string;
  projectId: number;
  projectName: string;
  scheduleNo: string;
  projectScheduleStatusId: number;
  projectScheduleStatusName: string;
  plannedCompletionDate: string; // Consider using a Date object for better handling of dates
  actualCompletionDate: string | null; // Consider using a Date object for better handling of dates
  createdById: string;
  createdBy: string;
  createdDate: string; // Consider using a Date object for better handling of dates
  totalTask: number;
  totalTaskCompleted: number;
  totalSubTask: number;
  totalSubTaskCompleted: number;
  totalCount: number;
  rowNum: number;
}