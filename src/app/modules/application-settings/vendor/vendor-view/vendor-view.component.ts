import { DATA_PRELOADER } from './../../../../core/modules/layouts/layout.model';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorService } from 'src/app/core/services/vendor.service';

@Component({
  selector: 'app-vendor-view',
  templateUrl: './vendor-view.component.html',
  styleUrls: ['./vendor-view.component.scss']
})
export class VendorViewComponent {
  vendorDetail: any = {}
  label: any = "Vendor Detail";
  breadCrumbItems: any = [
    { label: "Vendor" },
    { label: "Vendor Detail", active: true },
  ];

  constructor(private vendorService: VendorService, private router: Router) {
    if (VendorService.selectedVendorId == 0) {
      this.router.navigate(['/application-settings/vendor/vendor-list'])
    } else {

      this.getVendorDetails(VendorService.selectedVendorId);
    }
  }


  ngOnInit() {
  }

  getVendorDetails(id) {
    this.vendorService.getVendorByVendorId(id).subscribe({
      next: (res: any) => {
        this.vendorDetail = res.data
      }
    })
  }

  toUpperCaseword(str){
    if(str)return str.toUpperCase()
    else return ""
  }

  goBack(){
    this.router.navigate(['/application-settings/vendor/vendor-list']);
  }
}
