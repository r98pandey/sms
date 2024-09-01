// models.ts
export interface Task {
    taskType: string;
    formattedTime: string;
  }
  
  export interface AttendanceWorkingHours {
    currentMonthHoursMinutes: string;
    previousMonthHoursMinutes: string;
    percentageDifference: number;
    changeIndicator: string;
  }
  
  export interface ProjectManagementStatus {
    projectTaskStatusId: number;
    projectTaskStatusName: string;
    totalTask: number;
  }
  
  export interface Attendance {
    totalDaysAttended: number;
    totalDaysAbsent: number;
  }
  
  export interface ProjectTask {
    projectTaskId: number;
    startDate: string;
    endDate: string;
    actualStartDate: string | null;
    actualEndDate: string | null;
    startDateStatus: string;
    actualStartDateStatus: string;
    endDateStatus: string;
    completionStatus: string;
  }
  
  export interface DataModel {
    myDailyAttendanceWorkingHours: Task[];
    myDailyAttendanceWorkingHoursByCurrentAndPreviusPercentage: AttendanceWorkingHours;
    myDailyProjectWorkingHoursByCurrentAndPreviusPercentage: AttendanceWorkingHours;
    myProjectManagementTaskByStatus: ProjectManagementStatus;
    myProjectManagementSubTaskByStatus: ProjectManagementStatus;
    myDailyAttendance_AttendAndAbsent: Attendance;
    myProjectManagementTaskAging: ProjectTask[];
  }
  