import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { AuthAssetService } from 'src/app/core/services/auth-asset.service';

@Component({
  selector: 'app-advance-filter',
  templateUrl: './advance-filter.component.html',
  styleUrls: ['./advance-filter.component.scss'],
  providers: [NgbActiveModal],
})
export class AdvanceFilterComponent  implements OnInit {
  isProject: any;

  @Input() page: any;
  @Input() searchFieldArray: any = [];
  @Input() searchOldDataFieldArray: any = {};
  currentObject: any = {};
  
  constructor(
    private auth: AuthAssetService,
    private offcanvasService: NgbOffcanvas
  
  ) {
    this.isProject = this.auth.getisProject();
  }
  ngOnInit(): void {
    if (Object.keys(this.searchOldDataFieldArray).length == 0) {
      this.searchFieldArray.forEach((ele, i) => {
        ele.value = null;
      });
    }
    if (this.searchOldDataFieldArray) {
      let oldobje = Object.keys(this.searchOldDataFieldArray);
      for (let i = 0; i < this.searchFieldArray.length; i++) {
        for (let j = 0; j < oldobje.length; j++) {
          if (oldobje[j] == this.searchFieldArray[i].sendobject) {
            this.searchFieldArray[i].value = this.searchOldDataFieldArray[oldobje[j]];
            this.currentObject[this.searchFieldArray[i].sendobject] = this.searchOldDataFieldArray[oldobje[j]];

          }
        }
      }
    }
  }
  close(){
    this.offcanvasService.dismiss();
  }
  onselectObject(event: any, obj: any) {
    for (let i = 0; i < this.searchFieldArray.length; i++) {
      if (obj.type == 'input') {
        if (obj.label == this.searchFieldArray[i].label) {
          this.currentObject[obj.sendobject] = event.target.value;
        }
      } else {
        if (event) {
          if (event.id)
            if (obj.label == this.searchFieldArray[i].label) {
              this.currentObject[obj.sendobject] = event.id;
            }
        }
      }

      if (event === undefined) {
        if (obj.label == this.searchFieldArray[i].label) {
          delete this.currentObject[obj.sendobject];
        }
      }
    }
  }

  clear_search() {
    if (this.searchFieldArray && this.searchFieldArray.length > 0) {
      for (let i = 0; i < this.searchFieldArray.length; i++) {
        this.searchFieldArray[i].value = null;
        delete this.currentObject[this.searchFieldArray[i].sendobject];
      }
    }
  }
}
