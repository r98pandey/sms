import { Location } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { NgbActiveModal, NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Spinkit } from "ng-http-loader";
import { merge, fromEvent, map, Observable, Observer } from 'rxjs';
import { RouteWatcherService } from './core/services/route-watcher.service';
import { ShepherdService } from 'angular-shepherd';
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  public spinkit = Spinkit;
  onlineMessage;

  constructor(private router: Router, private shepherdService: ShepherdService, private location: Location, private routeWatcherService: RouteWatcherService) {
    this.createOnline$().subscribe((isOnline) => {

      if (isOnline) {
        this.onlineMessage = 'You are connected to internet';
      } else {
        this.onlineMessage =
          'Connection lost, Please check your internet connection.';
        this.router.navigate(['/error/offline'])
      }
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.shepherdService.isActive)
          this.shepherdService.complete();

      }
    });


  }
  ngOnInit(): void { }


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


}
