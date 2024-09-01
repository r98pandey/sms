import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ticket-type',
  templateUrl: './ticket-type.component.html',
  styleUrls: ['./ticket-type.component.scss']
})
export class TicketTypeComponent implements OnInit {

  breadCrumbItems!: Array<{}>;
  
  constructor(private router :Router) { }

  ngOnInit(): void {
   
  }

}
