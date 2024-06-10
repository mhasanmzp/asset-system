import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-assigned-conveyance',
  templateUrl: './assigned-conveyance.component.html',
  styleUrls: ['./assigned-conveyance.component.scss'],
})
export class AssignedConveyanceComponent implements OnInit {
  allConveyance: any;
  isModalOpen = false;
  reasonForm!: FormGroup;
  singleConveyanceData: any;
  conveyanceId: any;
  selectedData: any;
  isDisplayOpen = false;
  enabled:any;
  accountId: boolean = true;

  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    let userId = +localStorage.getItem('userId');
    if (userId == 201) {
      this.accountId = false;
    }
    this.fetchConveyance();
    this.reasonForm = this.formBuilder.group({
      reason: ['', Validators.required],
    });
  }

  getStatusColor(status: string): { [key: string]: string } {
    switch (status.toLowerCase()) {
      case 'approved':
        return { color: 'green' };
      case 'new':
        return { color: 'blue' };
      case 'in-progress':
        return { color: 'orange' };
      case 'rejected':
        return { color: 'red' };
      default:
        return {}; 
    }
  }

  fetchConveyance() {
    this.commonService.presentLoading1();

    let userId = +localStorage.getItem('userId');
    this.commonService
      .getManagerConveyance({
        employeeId: userId,
        employeeIdMiddleware: userId,
        permissionName: 'Dashboard',
      })
      .then(
        (res: any) => {
          res.map((item: any) => {
            if (item.isApprovedByReportingManager == 0) {
              item.isApprovedByReportingManager = 'false';
            } else {
              item.isApprovedByReportingManager = 'true';
            }

            if (item.isApprovedByAvp == 0) {
              item.isApprovedByAvp = 'false';
            } else {
              item.isApprovedByAvp = 'true';
            }
          });
          this.allConveyance = res;
          this.commonService.loadingDismiss1();
        },
        (error) => {
          this.commonService.showToast('error', error.error.msg);
          this.commonService.loadingDismiss1();

          if (error.error.statusCode == 401) {
            localStorage.clear();
            sessionStorage.clear();
            this.commonService.loadingDismiss1();
          }
        }
      );
  }

  onApproveClick(data: any) {
    let managerApproval: boolean;
    let managerColor: any;

    this.commonService.presentLoading1();

    this.allConveyance.map((item) => {
      if (item.convinceAndCalm_Id == data.convinceAndCalm_Id) {
        managerApproval = item.isApprovedByReportingManager;
        managerColor = item.isApprovedByReportingManagercolor;
      }
    });

    let userId = +localStorage.getItem('userId');
    this.commonService
      .updateConveyance({
        employeeId: userId,
        reason: '',
        status: 'Approved',
        travelData: data.travelData,
        employeeIdMiddleware: userId,
        convinceAndCalm_Id: data.convinceAndCalm_Id,
        permissionName: 'Dashboard',
        isApprovedByReportingManager: managerApproval,
        isApprovedByReportingManagercolor: managerColor,
      })
      .then(
        (res: any) => {
          this.commonService.showToast('success', res.message);
          this.fetchConveyance();
          this.commonService.loadingDismiss1();
        },
        (error) => {
          this.commonService.showToast('error', error.error.msg);
          this.commonService.loadingDismiss1();
          if (error.error.statusCode == 401) {
            localStorage.clear();
            sessionStorage.clear();
            this.commonService.loadingDismiss1();
          }
        }
      );
  }
  onRejectClick(data: any) {
    this.isModalOpen = true;
    this.selectedData = data;
  }

  close() {
    this.isModalOpen = false;
  }
  onReasonSubmit(reasonData: any) {
    let managerApproval: boolean;
    let managerColor: any;
    this.commonService.presentLoading1();

    this.allConveyance.map((item) => {
      if (item.convinceAndCalm_Id == this.selectedData.convinceAndCalm_Id) {
        managerApproval = item.isApprovedByReportingManager;
        managerColor = item.isApprovedByReportingManagercolor;
      }
    });

    let userId = +localStorage.getItem('userId');
    this.commonService
      .updateConveyance({
        employeeId: userId,
        reason: reasonData.reason,
        status: 'Rejected',
        travelData: this.selectedData.travelData,
        employeeIdMiddleware: userId,
        convinceAndCalm_Id: this.selectedData.convinceAndCalm_Id,
        permissionName: 'Dashboard',
        isApprovedByReportingManager: managerApproval,
        isApprovedByReportingManagercolor: managerColor,
      })
      .then(
        (res: any) => {

          this.commonService.showToast('success', res.message);
          this.selectedData = '';
          this.reasonForm.reset();
          this.fetchConveyance();
          this.isModalOpen = false;
          this.commonService.loadingDismiss1();
        },
        (error) => {
          this.commonService.showToast('error', error.error.msg);
          this.commonService.loadingDismiss1();
          if (error.error.statusCode == 401) {
            this.selectedData = '';
            this.isModalOpen = false;
            localStorage.clear();
            sessionStorage.clear();
            this.commonService.loadingDismiss1();
          }
        }
      );
  }

  displayData(data: any) {
   
    this.singleConveyanceData = data.travelData;
    this.conveyanceId = data.convinceAndCalm_Id;

    this.isDisplayOpen = true;
    if (data.status == 'New' || data.status == 'In-progress') {
      this.enabled = false;
    } else {
      this.enabled = true;
    }
  }

  displayClose() {
    this.isDisplayOpen = false;
  }

  onAmountChange(data: any) {
  }
  onSubmit() {
    let managerApproval: boolean;
    let managerColor: any;

    this.commonService.presentLoading1();

    this.allConveyance.map((item) => {
      if (item.convinceAndCalm_Id == this.conveyanceId) {
        managerApproval = item.isApprovedByReportingManager;
        managerColor = item.isApprovedByReportingManagercolor;
      }
    });

    let userId = +localStorage.getItem('userId');
    this.commonService
      .updateConveyance({
        employeeId: userId,
        travelData: this.singleConveyanceData,
        reason: '',
        status: 'Approved',
        employeeIdMiddleware: userId,
        convinceAndCalm_Id: this.conveyanceId,
        permissionName: 'Dashboard',
        isApprovedByReportingManager: managerApproval,
        isApprovedByReportingManagercolor: managerColor,
      })
      .then(
        (res: any) => {
          this.commonService.showToast('success', res.message);

          this.fetchConveyance();
          this.isDisplayOpen = false;
          this.commonService.loadingDismiss1();
        },
        (error) => {
          this.commonService.showToast('error', error.error.msg);
          this.commonService.loadingDismiss1();
          if (error.error.statusCode == 401) {
            this.commonService.loadingDismiss1();
          }
        }
      );
  }
}
