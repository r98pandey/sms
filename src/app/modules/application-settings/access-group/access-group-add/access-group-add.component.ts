import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccessGroupService } from 'src/app/core/services/access-group.service';
import { LocalStoreService } from "src/app/core/services/local-store.service";
import { RoleService } from 'src/app/core/services/role.service';
import { UserProfileService } from "src/app/core/services/user.service";
import Swal from "sweetalert2";


@Component({
  selector: 'app-access-group-add',
  templateUrl: './access-group-add.component.html',
  styleUrls: ['./access-group-add.component.scss']
})
export class AccessGroupAddComponent implements OnInit {
  addAccessGroupForm: FormGroup;
  label: any = "Access Group";
  breadCrumbItems: any = [
    { label: "Access Group" },
    { label: "Access Group Add", active: true },
  ];
  roleList:any[]=[];
  constructor(
    private formBuilder: FormBuilder,
    private accessGroupService: AccessGroupService,
    private localStorage:LocalStoreService,
    private router: Router,
    private userService: UserProfileService,
    public roleService: RoleService) { 
    //this.accessGroupData=JSON.parse(this.localStorage.getItem('access-group-data'));
  }

  ngOnInit(): void {
    this.getAddFromBinding();
    this.getRole();
  }

  getAddFromBinding() {

    this.addAccessGroupForm = this.formBuilder.group({
      name: ['', Validators.required],
      roleId: [null, Validators.required],
      remark: ['']
    });
  }
  get name() { return this.addAccessGroupForm.get('name'); }
  get roleId() { return this.addAccessGroupForm.get('roleId'); }
  get remark() { return this.addAccessGroupForm.get('remark'); }
  
  goBack(){    
    this.router.navigate(['/application-settings/access-group/access-group-list']);    
  }
  
  getRole() {
    this.userService.getRoleListForAccessGroupCreation().subscribe(
      (res: any) => {
        this.roleList = res.data;
      },
      (err) => {
        //console.log(err);
      }
    );
  }

  submitAccessGroupAddHandler(){
    let requestData = {
      RoleId: this.roleId.value,
      Name: this.name.value,
      Remark: this.remark.value

    }
    this.accessGroupService.postCreateAccessGroup(requestData).subscribe((res: any) => {     
      this.addAccessGroupForm.reset();
      this.goBack();  
      this.success(res);
    }, (err: any) => {
      //console.log("error", err);
    });
  }

  success(res: any) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res.message,
      showConfirmButton: false,
      timer: 3000,
    });
  }
}
