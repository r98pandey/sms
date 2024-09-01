import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asset-handler',
  templateUrl: './asset-handler.component.html',
  styleUrls: ['./asset-handler.component.scss']
})
export class AssetHandlerComponent implements OnInit {

  breadCrumbItems!: Array<{}>;
  
  constructor(private router :Router) { }

  ngOnInit(): void {
   
  }

}
