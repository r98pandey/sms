import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class PreviousRouteService {


  private previousUrl: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public previousUrl$: Observable<string> = this.previousUrl.asObservable();


  constructor(private router: Router) {

  }
  

  setPreviousUrl(previousUrl: string) {
    this.previousUrl.next(previousUrl);
}
}