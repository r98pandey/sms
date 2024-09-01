import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-list-type',
  templateUrl: './check-list-type.component.html',
  styleUrls: ['./check-list-type.component.scss']
})
export class CheckListTypeComponent implements OnInit {

  breadCrumbItems!: Array<{}>;
  
  constructor(private router :Router) { }

  ngOnInit(): void {
   
  }

}
