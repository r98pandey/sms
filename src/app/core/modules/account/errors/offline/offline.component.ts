import { Location } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, merge, fromEvent, map, Observer } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.component.html',
  styleUrls: ['./offline.component.scss']
})

/**
 * Offline Component
 */
export class OfflineComponent implements OnInit {

  constructor(private location: Location,private router:Router) { }

  ngOnInit(): void {
  }
  back() {
    this.createOnline$().subscribe((isOnline) => {
    
      if (isOnline) {
        this.backtoHome();
      } else {
        this.warinng('Connection lost, Please check your internet connection.');
      }
    });
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

  createOnline$(): Observable<boolean> {
    return merge(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      })
    );
  }

  @HostListener('window:online')
  onOnline(): void {
    this.location.back();
  }
  warinng(warning) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: warning,
      showConfirmButton: false,
      timer: 5000,
    });
  }
}
