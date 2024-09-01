import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  returnStatusClasses(id) {
    if (id == 1) {
      return 'bg-blue-subtle text-blue';
    } else if (id == 2) {
      return 'bg-warning';
    } else if (id == 3) {
      return 'bg-secondary';
    } else if (id == 4) {
      return 'bg-primary';
    } else if (id == 5) {
      return 'bg-blue-subtle text-blue';
    } else if (id == 6) {
      return 'bg-secondary';
    } else if (id == 7) {
      return 'bg-primary';
    } else if (id == 8) {
      return 'bg-dark-subtle text-dark';
    } else if (id == 9) {
      return 'bg-secondary';
    } else if (id == 10) {
      return 'bg-grey';
    } else if (id == 11) {
      return 'bg-dark-subtle text-dark';
    } else if (id == 12) {
      return 'bg-warning';
    } else if (id == 13) {
      return 'bg-success';
    } else if (id == 14) {
      return 'bg-primary';
    } else if (id == 15) {
      return 'bg-blue-subtle text-blue';
    } else if (id == 16) {
      return 'bg-grey';
    } else if (id == 17) {
      return 'bg-secondary';
    } else if (id == 18) {
      return 'bg-grey';
    } else if (id == 19) {
      return 'bg-grey';
    } else if (id == 20) {
      return 'bg-warning';
    } else if (id == 21) {
      return 'bg-warning';
    } else if (id == 22) {
      return 'bg-warning';
    } else if (id == 23) {
      return 'bg-warning';
    } else if (id == 24) {
      return 'bg-warning';
    } else if (id == 25) {
      return 'bg-warning';
    } else if (id == 26) {
      return 'bg-warning';
    } else if (id == 27) {
      return 'bg-warning';
    } else if (id == 28) {
      return 'bg-warning';
    } else if (id == 29) {
      return 'bg-primary';
    } else if (id == 30) {
      return 'bg-warning';
    } else if (id == 31) {
      return 'bg-info-subtle text-info';
    } else if (id == 32) {
      return 'bg-success';
    } else if (id == 33) {
      return 'bg-success';
    } else if (id == 34) {
      return 'bg-danger';
    } else if (id == 35) {
      return 'bg-danger';
    } else if (id == 36) {
      return 'bg-danger';
    } else if (id == 37) {
      return 'bg-danger';
    } else if (id == 38) {
      return 'bg-danger';
    } else if (id == 39) {
      return 'bg-danger';
    } else if (id == 40) {
      return 'bg-danger';
    } else if (id == 41) {
      return 'bg-dark-subtle text-dark';
    } else if (id == 42) {
      return 'bg-success';
    } else if (id == 43) {
      return 'bg-primary';
    } else if (id == 44) {
      return 'bg-blue-subtle text-blue';
    } else if (id == 45) {
      return 'bg-info';
    } else if (id == 46) {
      return 'bg-danger';
    } else if (id == 47) {
      return 'bg-grey';
    } else if (id == 48) {
      return 'bg-primary';
    } else if (id == 49) {
      return 'bg-danger';
    }
  }

  returnStatusWfClasses(id) {
    if (id == 1) {
      return 'text-primary';
    } else if (id == 2) {
      return 'text-primary';
    } else if (id == 3) {
      return 'text-primary';
    } else if (id == 4) {
      return 'text-primary';
    } else if (id == 5) {
      return 'text-primary';
    } else if (id == 6) {
      return 'text-primary';
    } else if (id == 7) {
      return 'text-primary';
    } else if (id == 8) {
      return 'text-primary';
    } else if (id == 9) {
      return 'text-primary';
    } else if (id == 10) {
      return 'text-grey';
    } else if (id == 11) {
      return 'text-grey';
    } else if (id == 12) {
      return 'text-grey';
    } else if (id == 13) {
      return 'text-grey';
    } else if (id == 14) {
      return 'text-grey';
    } else if (id == 15) {
      return 'text-grey';
    } else if (id == 16) {
      return 'text-grey';
    } else if (id == 17) {
      return 'text-grey';
    } else if (id == 18) {
      return 'text-grey';
    } else if (id == 19) {
      return 'text-grey';
    } else if (id == 20) {
      return 'text-warning';
    } else if (id == 21) {
      return 'text-warning';
    } else if (id == 22) {
      return 'text-warning';
    } else if (id == 23) {
      return 'text-warning';
    } else if (id == 24) {
      return 'text-warning';
    } else if (id == 25) {
      return 'text-warning';
    } else if (id == 26) {
      return 'text-warning';
    } else if (id == 27) {
      return 'text-warning';
    } else if (id == 28) {
      return 'text-warning';
    } else if (id == 29) {
      return 'text-primary';
    } else if (id == 30) {
      return 'text-warning';
    } else if (id == 31) {
      return 'text-info';
    } else if (id == 32) {
      return 'text-success';
    } else if (id == 33) {
      return 'text-success';
    } else if (id == 34) {
      return 'text-danger';
    } else if (id == 35) {
      return 'text-danger';
    } else if (id == 36) {
      return 'text-danger';
    } else if (id == 37) {
      return 'text-danger';
    } else if (id == 38) {
      return 'text-danger';
    } else if (id == 39) {
      return 'text-danger';
    } else if (id == 40) {
      return 'text-danger';
    } else if (id == 41) {
      return 'text-dark';
    } else if (id == 42) {
      return 'text-dark';
    } else if (id == 43) {
      return 'text-dark';
    } else if (id == 44) {
      return 'text-dark';
    } else if (id == 45) {
      return 'text-dark';
    } else if (id == 46) {
      return 'text-dark';
    } else if (id == 47) {
      return 'text-dark';
    } else if (id == 48) {
      return 'text-dark';
    }else if (id == 49) {
      return 'text-danger';
    }
  }

}