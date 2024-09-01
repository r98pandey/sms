import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-component-list',
  templateUrl: './main-component-list.component.html',
  styleUrl: './main-component-list.component.scss'
})
export class MainComponentListComponent implements OnInit {
  listView: boolean = true;
  gridView: boolean = false;

  ngOnInit(): void {
    this.listView =
      sessionStorage.getItem("listView") == null
        ? true
        : sessionStorage.getItem("listView") == "true"
          ? true
          : false;
    this.gridView =
      sessionStorage.getItem("gridView") == null
        ? false
        : sessionStorage.getItem("gridView") == "true"
          ? true
          : false;
  }
  
  getValueCurrent(event){
    this.listView =sessionStorage.getItem("listView") == null? true: sessionStorage.getItem("listView") == "true"? true: false;
    this.gridView =sessionStorage.getItem("gridView") == null? false: sessionStorage.getItem("gridView") == "true"? true: false;

  }
}
