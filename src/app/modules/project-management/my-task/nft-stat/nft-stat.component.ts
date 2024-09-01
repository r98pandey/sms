import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-nft-stat',
  templateUrl: './nft-stat.component.html',
  styleUrls: ['./nft-stat.component.scss']
})

/**
 * Nft-Stat Component
 */
export class NftStatComponent implements OnInit {

  @Input() icon: string | undefined;
  @Input() title: string | undefined;
  @Input() currentMonthHoursMinutes: any | undefined;
  @Input() percentageDifference: string | undefined;
  @Input() changeIndicator: string | undefined;
  @Input() previousMonthHoursMinutes: string | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  num: number = 0;
  option = {
    startVal: this.num,
    useEasing: true,
    duration: 2,
    decimalPlaces: 2,
  };

}
