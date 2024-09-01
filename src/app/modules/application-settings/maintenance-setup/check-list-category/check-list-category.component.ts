import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-list-category',
  templateUrl: './check-list-category.component.html',
  styleUrls: ['./check-list-category.component.scss']
})
export class CheckListCategoryComponent implements OnInit {

  breadCrumbItems!: Array<{}>;
  
  constructor(private router :Router) { }

  ngOnInit(): void {
   
  }

}
