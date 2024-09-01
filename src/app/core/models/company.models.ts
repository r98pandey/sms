export interface CompanyModel {
    companyId:string;
    companyCode: string;
    companyName: string;
    contactPerson: string;
    mobileNo: string;
    address1: string;
    address2: string;
    address3: string;
    postalCode: string;
    country: string;
    officePhoneNo: string;
    officeFaxNo: string;
    companyHead: string;
    CompanyLogoBase64string: any;
  }

  export interface ViewCompanyPayloadModel {
    companyId:number;
  }
  
 