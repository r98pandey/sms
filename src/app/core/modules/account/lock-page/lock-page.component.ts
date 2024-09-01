import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lock-page',
  templateUrl: './lock-page.component.html',
  styleUrls: ['./lock-page.component.scss']
})
export class LockPageComponent implements OnInit {

  // set the current year
  year: number = new Date().getFullYear();
  // Carousel navigation arrow show

  url:any=''
  showNavigationArrows: any;

  constructor(private router:Router) { 

  }

  ngOnInit(): void {
    this.url=this.router.url;
    console.log("url",this.url)

  }

}
