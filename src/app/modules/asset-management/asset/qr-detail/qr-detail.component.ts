import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { DefaultUrlSerializer } from "@angular/router";
import { AssetService } from "src/app/core/services/asset.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-qr-detail",
  templateUrl: "./qr-detail.component.html",
  styleUrls: ["./qr-detail.component.scss"],
})
export class QrDetailComponent implements OnInit {
  list: any;
  displayLength = 10;
  startIndex = 0;
  departmentName = null;
  CatName = null;
  SubCatName = null;
  AssetStatus = null;
  AssetName = null;
  AssetTagId = null;
  _globalCompanyId: string | number;
  imageUrl = environment.apiUrl;
  closeIcon: boolean = true;
  date = new Date();
  to = 0;
  from = 0;
  pageSize = 10;
  pageNo = 1;
  totalRecordsFromApi: number = 0;
  advanceSearchOn = true;
  page = 1;
  constructor(private assetService: AssetService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this._globalCompanyId = localStorage.getItem("globalCompanyId");
    this.loadData(
      this.displayLength,
      this.startIndex,
      this.departmentName,
      this.CatName,
      this.SubCatName,
      this.AssetStatus,
      this.AssetName,
      this.AssetTagId
    );
  }
  loadPage(pageNo: number) {
    this.pageNo = pageNo;
    this.loadData(
      this.pageSize,
      this.pageSize * (pageNo - 1),
      null,
      null,
      null,
      null
    );
    this.pageNo = 1;
  }

  loadPage2(pageNo: number) {
    this.pageNo = pageNo;
    this.loadData(this.pageSize, this.pageSize * (pageNo - 1));
    //console.log(pageNo);
  }

  loadData(
    displayLength: number = 10,
    startIndex: Number = 0,
    departmentName: any = null,
    CatName: any = null,
    SubCatName: any = null,
    AssetStatus: any = null,
    AssetName: any = null,
    AssetTagId: any = null
  ) {
    this.assetService
      .getCommanAssetList_ByPagination(
        this._globalCompanyId,
        displayLength,
        startIndex,
        departmentName,
        CatName,
        SubCatName,
        AssetStatus,
        AssetName,
        AssetTagId
      )
      .subscribe(
        (res: any) => {
          this.list = res;
          if (this.list.length > 0) {
            this.totalRecordsFromApi = res[0].totalCount;
            this.from = res.reduce(
              (min, p) => (p.rowNum < min ? p.rowNum : min),
              res[0].rowNum
            );
            this.to = res.reduce(
              (max, p) => (p.rowNum > max ? p.rowNum : max),
              res[0].rowNum
            );
            this.pageSize = this.displayLength;
          } else {
            this.totalRecordsFromApi = 0;
            this.from = 0;
            this.to = 0;
            this.pageSize = this.displayLength;
          }
        },
        (err) => {
          //console.log(err);
        }
      );
  }

  // public downloadPdf() {
  //   setTimeout(() => {
  //     this.closeIcon = false;
  //     var data = document.getElementById('contentToConvert');
  //     let todayDate = this.datePipe.transform(this.date, "dd-MM-YYYY")
  //     let fileName = 'AssetQrcode_' + todayDate + '.pdf';
  //     html2canvas(data).then((canvas) => {
  //       let imgWidth = 200;
  //       let pageHeight = 295;
  //       let imgHeight = (canvas.height * imgWidth) / canvas.width;
  //       let heightLeft = imgHeight;
  //       const contentDataURL = canvas.toDataURL('image/png');
  //       let pdf = new jsPDF('p', 'mm', 'a4');
  //       let position = 0;
  //       pdf.addImage(contentDataURL, 'PNG', 5, position, imgWidth, imgHeight);
  //       pdf.save(fileName);
  //     });
  //   }, 500);
  // }

  public downloadPdf() {
    window.print();
  }

  toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  }

  parse(url: any) {
    let dus = new DefaultUrlSerializer();
    if (/\/\//.test(url)) {
      url = url.replace(/\/\//);
    }
    //console.log("url", url);
    return this.imageUrl + url;
  }
  // serialize(tree: UrlTree): any {
  //   let dus = new DefaultUrlSerializer(),
  //   path = dus.serialize(tree);
  //   return path;
  // }
}
