import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-crm-stat',
  templateUrl: './crm-stat.component.html',
  styleUrls: ['./crm-stat.component.scss']
})

/**
 * Crm Stat Component
 */
export class CrmStatComponent implements OnInit {
  num: number = 0;
  option = {
  startVal: this.num,
  useEasing: true,
  duration: 2,
  decimalPlaces: 0,
  };
  @Input() title: string | undefined;
  @Input() value: any | undefined;
  @Input() icon: string | undefined;
  @Input() profit: string | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
