import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WizardComponent as BaseWizardComponent } from 'angular-archwizard';
import { RegisterService } from 'src/app/core/services/register.service';
import { ToastService } from "../../../../shared/Service-common/toast-service";
import { DropdownService } from 'src/app/shared/Service-common/dropdown.service';
import { CdkStep, CdkStepper } from '@angular/cdk/stepper';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  
  countryId: any[] = [];
  registerDisable!: boolean;
  @ViewChild('cdkStepper') wizardForm: CdkStepper;
  @ViewChild('step1') step1: CdkStep;
  @ViewChild('step2') step2: CdkStep;

  
  detailsItem: any;
  returnUrl: any;
  countryList: any;
  isRegister: boolean = false;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  errorData: any;
  prefixSeparatorList=["-",'/']
  simpleItems: string[];
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private registerService: RegisterService,
    public toastservice: ToastService,
    public dropdownService:DropdownService
  ) {
    this.isRegister = this.router.url.includes('register');
    let eror = JSON.parse(localStorage.getItem("error"));
      if (!eror) {
        this.router.navigate(['/auth/login']);
      }
  
  }


  ngOnInit(): void {
  
      this.buildForm();
       this.getCountryList();
      let getitem:any=localStorage.getItem('error')
      this.errorData = JSON.parse(getitem)?.token;
    
  }
  getCountryList() {
    this.dropdownService.getCountryList().subscribe((res: any) => {
      this.countryList = res.data;
    });
  }
  buildForm(): void {
    this.firstFormGroup = this.formBuilder.group({
      organisationName: ['', [Validators.required]],
      address1: [''],
      address2: [''],
      address3: [''],
      postalCode: [''],
      country: [null]
    });
    this.secondFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', Validators.required],
      faxNumber: [''],
      websiteURL: [''],
    });
    this.thirdFormGroup = this.formBuilder.group({
      prefixCompany: ['', [Validators.required]],
      prefixDepartment: [''],
      prefixCategory: [''],
      prefixSubcategory: [''],
      prefixSeparator: [null, [Validators.required]],
      NoOfCompany: [1, [Validators.required]],
      NoOfUsers: [3, [Validators.required]],
      NoOfProject: [1, [Validators.required]],
      NoOfAssets: [100, [Validators.required]],

      NoOfClient: [1, [Validators.required]],
NoOfClientUsers: [1, [Validators.required]],
    });
  }

  // first step controls
  get organisationName() {
    return this.firstFormGroup.get('organisationName');
  }
  get address1() {
      return this.firstFormGroup.get('address1');
  }
  get address2() {
      return this.firstFormGroup.get('address2');
  }
  get address3() {
    return this.firstFormGroup.get('address3');
    
  }
  get postalCode() {
          return this.firstFormGroup.get('postalCode');
    
  }
  get country() {
      return this.firstFormGroup.get('country');
    
  }
  // Second step controls
  get email() {
      return this.secondFormGroup.get('email');    
    }
  get mobileNumber() {
      return this.secondFormGroup.get('mobileNumber');
  }
  get faxNumber() {
      return this.secondFormGroup.get('faxNumber');
  }
  get websiteURL() {
      return this.secondFormGroup.get('websiteURL');
  }
  // third step controls
  get prefixCompany() {
      return this.thirdFormGroup.get('prefixCompany');
  }
  get prefixDepartment() {
      return this.thirdFormGroup.get('prefixDepartment');
  }
  get prefixCategory() {
      return this.thirdFormGroup.get('prefixCategory');
  }
  get prefixSubcategory() {
      return this.thirdFormGroup.get('prefixSubcategory');
  }
  get prefixSeparator() {
      return this.thirdFormGroup.get('prefixSeparator');
  }
  get NoOfCompany() {
    return this.thirdFormGroup.get('NoOfCompany');
  }
  get NoOfUsers() {
    return this.thirdFormGroup.get('NoOfUsers');
  }
  get NoOfProject() {
    return this.thirdFormGroup.get('NoOfProject');
  }
  get NoOfAssets() {
    return this.thirdFormGroup.get('NoOfAssets');
  }

  get NoOfClient() {
    return this.thirdFormGroup.get('NoOfClient');
  }
  get NoOfClientUsers() {
    return this.thirdFormGroup.get('NoOfClientUsers');
  }

 


  // step second submit 
  form2Submit() {
      if (this.secondFormGroup.valid) {
        this.wizardForm.next();
   }
  }

  // product organisation form submit

  onSubmit(): void {
    if (!this.thirdFormGroup.valid) {
      return
    } else {
      let formData = { ...this.firstFormGroup.getRawValue(), ...this.secondFormGroup.getRawValue(), ...this.thirdFormGroup.getRawValue() }
      let payload = {
        OrgName: formData?.organisationName ? formData?.organisationName : '',
        Address1: formData?.address1 ? formData?.address1 : '',
        Address2: formData?.address2 ? formData?.address2 : '',
        Address3: formData?.address3 ? formData?.address3 : '',
        PostalCode: formData?.postalCode ? formData?.postalCode : '',
        Country: formData?.country ? formData?.country : '',
        OrgPhoneNo: formData?.mobileNumber ? String(formData?.mobileNumber) : '',
        OrgFaxNo: formData?.faxNumber ? formData?.faxNumber : '',
        OrgEmail: formData?.email ? formData?.email : '',
        WebSiteURL: formData?.websiteURL ? formData?.websiteURL : '',
        PrefixComp: formData?.prefixCompany ? formData?.prefixCompany : false,
        PrefixDepartment: formData?.prefixDepartment ? formData?.prefixDepartment : false,
        PrefixCategory: formData?.prefixCategory ? formData?.prefixCategory : false,
        PrefixSubCategory: formData?.prefixSubcategory ? formData?.prefixSubcategory : false,
        PrefixSeparator: formData?.prefixSeparator ? formData?.prefixSeparator : '',
        OrgLogoURL: '',
        OrgStatus: '',
        NoOfCompany: formData?.NoOfCompany ? formData?.NoOfCompany : '',
        NoOfUsers: formData?.NoOfUsers ? formData?.NoOfUsers : '',
        NoOfProject: formData?.NoOfProject ? formData?.NoOfProject : '',
        NoOfAssets: formData?.NoOfAssets ? formData?.NoOfAssets : '',
        NoOfClient: formData?.NoOfClient ? formData?.NoOfClient : '',
        NoOfClientUsers: formData?.NoOfClientUsers ? formData?.NoOfClientUsers : '',
      }
      this.saveOrganisation(payload);
    }
  }

  saveOrganisation(payload:any): void {
    this.registerService.saveOrganisationMaster(payload).subscribe((res:any) => {
      this.registerDisable = false;
      this.success(res);
      this.toastservice.show(res?.message, { classname: 'bg-success text-white', delay: 1500 });  
      this.router.navigate(['/auth/login']);
      localStorage.removeItem('error');
      
    }, (err:any) => {
      this.error(err);
    });
  }


  success(res :any) {
   
  }

  error(err:any) {
    this.registerDisable = false;
  }

  onBack() {
    this.router.navigate(['/auth/login']);
    localStorage.removeItem('error');
    localStorage.clear();
    sessionStorage.clear();
  }
}
