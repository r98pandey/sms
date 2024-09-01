import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { CommonFunctionService } from "../../Service-common/common-function.service";
import { environment } from "../../../../environments/environment.prod";

@Component({
  selector: "app-audit-chart",
  templateUrl: "./audit-chart.component.html",
  styleUrls: ["./audit-chart.component.scss"],
})
export class AuditChartComponent implements OnInit, OnChanges {
  @Input() Data: any;
  @Input () showRequester:boolean=true;
  imgUrl: any = environment.apiUrl;
  activeIds: any[];

  constructor(private commonFunctionService: CommonFunctionService) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.activeIds = [];
    this.Data.sort((a, b) => a.wfProcessCreationId - b.wfProcessCreationId);

    this.Data.forEach((element, index) => {
      this.activeIds.push("static-" + index);
    });

  console.log(this.Data, "this.Datathis.Datathis.Data");
  }
  ngOnInit(): void {
    this.activeIds = [];
    this.Data.sort((a, b) =>a.wfProcessCreationId - b.wfProcessCreationId);

    this.Data.forEach((element, index) => {
      this.activeIds.push("static-" + index);
    });
    //console.log(this.Data, "this.Datathis.Datathis.Data");
  }

  returnStatusBadgeClassesStatus(id: any) {
    return this.commonFunctionService.returnStatusBadgeClasses(id);
  }
}
