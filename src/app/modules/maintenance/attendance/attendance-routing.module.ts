import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyAttendanceComponent } from './daily-attendance/daily-attendance.component';
import { TaskAttendanceComponent } from './task-attendance/task-attendance.component';
import { MonthYearWiseListComponent } from './month-year-wise-list/month-year-wise-list.component';

const routes: Routes = [
  {
    path: "daily-attendance",
    component: DailyAttendanceComponent
  },
  {
    path: "task-attendance",
    component: TaskAttendanceComponent
  }, 
   {
    path: "last-time-attendance",
    component: MonthYearWiseListComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list-ticket',
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
