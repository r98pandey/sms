import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgbActiveModal, NgbActiveOffcanvas, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RouteWatcherService {
  constructor(private router: Router, public activeModal: NgbModal, public activeOffcanvas: NgbOffcanvas) {
    this.watchRouteChanges();
  }

  watchRouteChanges() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.onRouteChange();
    });
  }

  private onRouteChange() {
    this.activeOffcanvas.dismiss();
    this.activeModal.dismissAll();
  }
}
