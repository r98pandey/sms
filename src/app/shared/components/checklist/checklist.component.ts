import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PreventiveService } from 'src/app/core/services/preventive.service';
import { CommonFunctionService } from '../../Service-common/common-function.service';
import { environment } from '../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { MessageModalComponent } from "src/app/shared/components/message-modal/message-modal.component";

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrl: './checklist.component.scss'
})
export class ChecklistComponent implements OnChanges, OnInit {

  @Input() configPreventiveId: any
  @Input() masterScheduleList:any={}
  scheduleCheckList: any[] = [];
  imageUrl: any = environment.apiUrl;
  preventiveMaintenanceTypeList: any[] = []
  constructor(public commonFunctionService: CommonFunctionService,
    private preventiveService: PreventiveService, private modalService: NgbModal) { }


  ngOnInit(): void {


  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getV2_MX_Config_PreventiveScheduleDetail()

  }
  getV2_MX_Config_PreventiveScheduleDetail() {
    let payload = {
      ConfigPreventiveId: this.configPreventiveId
    }
    this.preventiveService
      .getMX_ConfigScheduleCheckListSetup(payload)
      .subscribe((res: any) => {
     
        if (res.length != 0) {
          this.scheduleCheckList = this.getRawDataChanges(res.list)
        }

      });
  }

  getBorderBagde(id) {
    return this.commonFunctionService.returnAssetStatusBorderAndBadgeClasses(
      id
    );
  }

  getRawDataChanges(data: any) {
    const organizedData = {};
    data.forEach(item => {
      const assetId = item.assetId;
      if (!organizedData[assetId]) {
        organizedData[assetId] = {
          assetId: assetId,
          assetName: item.assetName,
          assetTagId: item.assetTagId,
          assetStatusId: item.assetStatusId,
          assetStatus: item.assetStatus,
          configPreventiveId: item.configPreventiveId,
          preventiveCategoryId: item.preventiveCategoryId,
          preventiveCategoryName: item.preventiveCategoryName,
          configPreventiveForAssetId: item.configPreventiveForAssetId,
          item: []
        };
      }
      organizedData[assetId].item.push({
        mX_Config_CheckListItemId: item.mX_Config_CheckListItemId,
        preventiveTypeId: item.preventiveTypeId,
        preventiveTypeName: item.preventiveTypeName,
        isActive: item.isActive,
        isNew: false
      });
    });
    return Object.values(organizedData);

  }
  storeUpdateCheckPreventiveTypeIdList: any = []
  updateCheckboxValue(event, mainindex, innerIndex, value) {
    this.scheduleCheckList[mainindex].item[innerIndex].isActive = event.target.checked;

    const assetId = this.scheduleCheckList[mainindex].assetId;
    const preventiveTypeId = this.scheduleCheckList[mainindex].item[innerIndex].preventiveTypeId;
    const existingIndex = this.storeUpdateCheckPreventiveTypeIdList.findIndex(item =>
      item.assetId === assetId && item.preventiveTypeId === preventiveTypeId
    );

    if (existingIndex === -1) {
      this.storeUpdateCheckPreventiveTypeIdList.push({ assetId, preventiveTypeId });
    }
    else {
      if (existingIndex !== -1) {
        this.storeUpdateCheckPreventiveTypeIdList.splice(existingIndex, 1);
      }
    }
    if (event.target.checked == false && this.scheduleCheckList[mainindex].item[innerIndex].isNew) {
      this.scheduleCheckList[mainindex].item.splice(innerIndex, 1);
    }

  }




  getMX_PreventiveMaintenanceTypeDrobDown(preventCategoryId, content, itemData, mainIndex) {
    if (this.masterScheduleList.pmScheduleStatusId == 4) {
      this.sweetAlertItemDisableScheduleStatusInactiveDetails()
    } else {
    let SearchPreventCategoryId = preventCategoryId;
    this.preventiveMaintenanceTypeList = [];
    let paylod = {
      SearchPreventCategoryId: SearchPreventCategoryId,
    };
    this.preventiveService
      .getMX_PreventiveMaintenanceTypeDrobDown(paylod)
      .subscribe(
        (res: any) => {
          if (res.list.length != 0) {

            this.preventiveMaintenanceTypeList = res.list.filter(aItem =>
              !itemData.some(bItem => aItem.preventiveTypeId === bItem.preventiveTypeId)
            );

            this.preventiveMaintenanceTypeList = this.preventiveMaintenanceTypeList.map(element => ({
              ...element,
              checked: false
            }));
            this.modalService.open(content, {
              ariaLabelledBy: "modal-basic-title",
              centered: true,
              windowClass: 'modalclass',
              backdrop: "static",
              keyboard: false,
            })
              .result.then(
                (result) => {
                  this.afterSubmitScheduleAssetChecklist(mainIndex)
                },
                (reason) => {
                  this.afterSubmitScheduleAssetChecklist(mainIndex)
                }
              );

          }

        },
        (err) => { }
      );}
  }

  sweetAlertItemDisableScheduleStatusInactiveDetails() {
    const modalRef = this.modalService.open(MessageModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.title = "You cannot add new check list items because the schedule is inactive";
    modalRef.componentInstance.subTitle = "";
    modalRef.componentInstance.buttonName = 'Ok'
    modalRef.result.then((result) => {
      if (result) {
        if (result == "success") {

        }
      }
    });
  }
  afterSubmitScheduleAssetChecklist(mainIndex) {
    this.preventiveMaintenanceTypeList.forEach((ele: any) => {
      if (ele.checked == true) {
        this.scheduleCheckList[mainIndex].item.push({
          mX_Config_CheckListItemId: 0,
          preventiveTypeId: ele.preventiveTypeId,
          preventiveTypeName: ele.preventiveTypeName,
          isActive: true,
          isNew: true
        });
        const assetId = this.scheduleCheckList[mainIndex].assetId;
        const preventiveTypeId = ele.preventiveTypeId;
        const existingIndex = this.storeUpdateCheckPreventiveTypeIdList.findIndex(item =>
          item.assetId === assetId && item.preventiveTypeId === preventiveTypeId
        );

        if (existingIndex === -1) {
          this.storeUpdateCheckPreventiveTypeIdList.push({ assetId, preventiveTypeId });
        }
        else {
          if (existingIndex !== -1) {
            this.storeUpdateCheckPreventiveTypeIdList.splice(existingIndex, 1);
          }
        }
      }

    })
  }


  createV2_MX_ScheduleAssetChecklist(event, index) {
    this.preventiveMaintenanceTypeList[index].checked = event.target.checked;
  }

  finalSubmit() {
    let combinedArray = [];
    const organizedData = {};
    this.scheduleCheckList.forEach((ele) => {
      this.storeUpdateCheckPreventiveTypeIdList.forEach(element => {
        if (element.assetId == ele.assetId) {
          const assetId = ele.assetId;
          if (!organizedData[assetId]) {
            organizedData[assetId] = {
              assetId: assetId,
              assetName: ele.assetName,
              assetTagId: ele.assetTagId,
              assetStatusId: ele.assetStatusId,
              assetStatus: ele.assetStatus,
              configPreventiveId: ele.configPreventiveId,
              preventiveCategoryId: ele.preventiveCategoryId,
              preventiveCategoryName: ele.preventiveCategoryName,
              configPreventiveForAssetId: ele.configPreventiveForAssetId,
              item: []
            };
          }
          ele.item.forEach(inner => {
            if (element.preventiveTypeId === inner.preventiveTypeId) {
              organizedData[assetId].item.push({
                mX_Config_CheckListItemId: inner.mX_Config_CheckListItemId,
                preventiveTypeId: inner.preventiveTypeId,
                preventiveTypeName: inner.preventiveTypeName,
                isActive: inner.isActive,
                isNew: inner.isNew
              });
            }
          });

        }
      });


    })
    combinedArray = Object.values(organizedData);
    let paylod = this.revertData(combinedArray);
    this.createUpdateSchedueleChecklistConfiguration(paylod)


  }

  shouldDisableCheckbox(items: any[]): boolean {
    if (!Array.isArray(items)) {
      return false; 
    }
    const checkedItems = items.filter(item => item.isActive);
    return checkedItems.length <= 1;
  }
  
  tooltipMessage(items: any): string {
    let ch=false
    if (!Array.isArray(items)) {
      ch= false; 
    }
    const checkedItems = items.filter(item => item.isActive);
    ch=checkedItems.length <= 1;
    if (ch) {
      return "This item cannot be unchecked because at least one item must be checked.";
    }
    return "";
}

  createUpdateSchedueleChecklistConfiguration(payloadData) {
    this.preventiveService.
      createUpdateSchedueleChecklistConfiguration(
        payloadData)
      .subscribe((res) => {
        this.success(res);
        this.storeUpdateCheckPreventiveTypeIdList=[];
        this.getV2_MX_Config_PreventiveScheduleDetail();

      });

  }
  success(res) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: res.message,
      showConfirmButton: false,
      timer: 3000,
    });
  }


  revertData(data) {
    const revertedData = [];
    data.forEach(asset => {
      const { assetId, assetName, assetTagId, assetStatusId, assetStatus, configPreventiveId, preventiveCategoryId, preventiveCategoryName, configPreventiveForAssetId, item } = asset;

      item.forEach(checklistItem => {
        revertedData.push({
          mX_Config_CheckListItemId: checklistItem.mX_Config_CheckListItemId,
          configPreventiveId: configPreventiveId,
          configPreventiveForAssetId: configPreventiveForAssetId,
          assetId: assetId,
          assetName: assetName,
          assetTagId: assetTagId,
          assetStatusId: assetStatusId,
          assetStatus: assetStatus,
          preventiveCategoryId: preventiveCategoryId,
          preventiveCategoryName: preventiveCategoryName,
          preventiveTypeId: checklistItem.preventiveTypeId,
          preventiveTypeName: checklistItem.preventiveTypeName,
          isActive: checklistItem.isActive,
          isNew: checklistItem.isNew,

        });
      });
    });

    return revertedData;
  }

}
