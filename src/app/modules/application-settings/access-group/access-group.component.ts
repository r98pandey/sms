import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access-group',
  templateUrl: './access-group.component.html',
  styleUrls: ['./access-group.component.scss']
})
export class AccessGroupComponent implements OnInit {

  breadCrumbItems!: Array<{}>;
  
  constructor(private router :Router) { }

  ngOnInit(): void {
   
  }

}
