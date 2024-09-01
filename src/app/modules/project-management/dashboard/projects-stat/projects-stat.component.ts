import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects-stat',
  templateUrl: './projects-stat.component.html',
  styleUrls: ['./projects-stat.component.scss']
})

/**
 * Projects Stat Component
 */
export class ProjectsStatComponent implements OnInit {
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
  @Input() persantage: string | undefined;
  @Input() profit: string | undefined;
  @Input() month: string | undefined;
  @Input() progressBar: any;
  @Input() subItem: any;


  constructor(private router: Router) { }

  ngOnInit(): void {
    //console.log(this.progressBar,"progressBar")
  }

  goToPageList(Type: any, statusId: any) {
    console.log(Type)
    if (Type == 'TICKETS') {
      localStorage.removeItem("objectSerachForTicket");
      let objectSerachForTicket: any = {};
      if (statusId) {
        objectSerachForTicket.SearchTicketStatusId =
          statusId;
      }
      localStorage.setItem(
        "objectSerachForTicket",
        JSON.stringify(objectSerachForTicket)
      );
      this.router.navigate(['/maintenance-management/corrective/ticket/list-ticket'])
    } else if (Type == 'SERVICE ORDERS') {
      localStorage.removeItem(
        "objectSerachForServiceOrder")
      let objectSerachForServiceOrder: any = {}
      if (statusId)
        objectSerachForServiceOrder.SearchWOStatusId =
          statusId;
      localStorage.setItem(
        "objectSerachForServiceOrder",
        JSON.stringify(objectSerachForServiceOrder)
      );
      this.router.navigate(['/maintenance-management/corrective/service-order/list-service-order'])
    } else if (Type == 'INCIDENTS') {
      localStorage.removeItem("objectSerachForTicket");
      let objectSerachForTicket: any = {};
      if (statusId) {
        objectSerachForTicket.SearchTicketStatusId =
          statusId;
      }
      objectSerachForTicket.SearchIsGlobal = "Global";
      objectSerachForTicket.SearchOperationType = 'Incident Report';
      localStorage.setItem(
        "objectSerachForTicket",
        JSON.stringify(objectSerachForTicket)
      );
      this.router.navigate(['/maintenance-management/corrective/ticket/list-ticket'])
    } else {

    }

  }

}
