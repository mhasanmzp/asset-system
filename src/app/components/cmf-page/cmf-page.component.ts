import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-cmf-page',
  templateUrl: './cmf-page.component.html',
  styleUrls: ['./cmf-page.component.scss'],
})
export class CmfPageComponent implements OnInit {
  fetchdata: any[] = [];
  isModalOpen = false;
  leavedetails: any;
  cmfForm: FormGroup;
  changeForm: FormGroup;
  changeReviewForm: FormGroup;
  changeForwardForm: FormGroup;
  singleCmfData: any;
  isDisplayOpen = false;
  projectList: any[] = [];
  userId: any;
  inputValue: string = "Ashish Sharma";


  constructor(
    private fb: FormBuilder,
    private authservice: AuthService,
    private commonservice: CommonService,
    private projectservice: ProjectService
  ) {
    this.cmfForm = this.fb.group({
      projectName: ['', Validators.required],
      clientLocation: ['', Validators.required],
      requestedBy: ['', Validators.required],
      department: ['', Validators.required],
      contact: ['', Validators.required],
      requestType: ['', Validators.required],
      priority: ['', Validators.required],
      changeDesc: ['', Validators.required],
      benefit: ['', Validators.required],
      painArea: ['', Validators.required],
      userBenefited: ['', Validators.required],
      costTime: ['', Validators.required],
      category: ['', Validators.required],
      resolutionType: ['', Validators.required],
      resolution: ['', Validators.required],
      recommendation: ['', Validators.required],
      analysis: ['', Validators.required, Validators.pattern['0']],
      testing: ['', Validators.required, Validators.pattern['0']],
      total: ['', Validators.required, Validators.pattern['00']],
    });

    this.changeForm = this.fb.group({
      status: ['', Validators.required],
    });

    this.changeReviewForm = this.fb.group({
      frwForReview: ['', Validators.required],
      status: ['', Validators.required],
    });
    this.changeForwardForm = this.fb.group({
      fwdForApproval: ['354 Ashish Sharma'],
      status: ['', Validators.required],
    });
  }
  ngOnInit() {
    this.fetchCmf();
    this.fetchProjectList();
    this.userId = +localStorage.getItem('userId');

    this.cmfForm.get('analysis').valueChanges.subscribe((value) => {
      this.updateField3();
    });

    this.cmfForm.get('testing').valueChanges.subscribe((value) => {
      this.updateField3();
    });
  }


  onInputChange(event: any) {
    event.target.value = this.inputValue;
  }
  isManagerAllowed(id: number) {
    if (id === 354) {
      return true;
    }
  }
  updateField3() {
    const field1Value = parseFloat(this.cmfForm.get('analysis').value);
    const field2Value = parseFloat(this.cmfForm.get('testing').value);

    if (!isNaN(field1Value) && isNaN(field2Value)) {
      this.cmfForm.get('total').setValue(field1Value);
    } else if (isNaN(field1Value) && !isNaN(field2Value)) {
      this.cmfForm.get('total').setValue(field2Value);
    } else if (!isNaN(field1Value) && !isNaN(field2Value)) {
      this.cmfForm.get('total').setValue(field1Value + field2Value);
    } else {
      this.cmfForm.get('total').setValue(null);
    }
  }

  fetchCmf() {
    this.commonservice.presentLoading1();
    
    this.authservice.fetchCmfData().then(
      (res: any) => {
        this.fetchdata = res.data;
        this.commonservice.loadingDismiss1();
      },
      (error) => {
        this.commonservice.showToast('error', error.error.msg);

        this.commonservice.loadingDismiss1();
      }
    );
  }

  getStatusColor(status: string) {
    switch (status) {
      case 'Approved':
        return { color: 'green' };
      case 'New':
        return { color: 'blue' };
      case 'In Progress':
        return { color: 'orange' };
      case 'Testing':
        return { color: 'purple' };
      case 'Released':
        return { color: 'grey' };
      case 'Rejected':
        return { color: 'red' };
      default:
        return {};
    }
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    this.cmfForm.reset();
  }

  fetchProjectList() {
    let formData = {
      organisationId: this.authservice.organisationId,
    };
    this.projectservice.fetchAllProjects(formData).then(
      (resp: any) => {
        this.projectList = resp;

      },
      (error) => {
        this.commonservice.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          this.commonservice.loadingDismiss1();
        }
      }
    );
  }
  onSubmit() {
    this.commonservice.presentLoading1();
    if (this.cmfForm.valid) {
      const formData = this.cmfForm.value;
      this.authservice.cmfdata(formData).then(
        (res: any) => {
          this.commonservice.showToast('success', 'Submit succesfully');
          this.fetchCmf();
          this.isModalOpen = false;
          this.commonservice.loadingDismiss1();
        },
        (error) => {
          this.commonservice.showToast('error', error.error.msg);
          this.isModalOpen = false;
          this.commonservice.loadingDismiss1();
        }
      );
    }
  }

  displayData(data: any) {
    this.singleCmfData = data;

    this.isDisplayOpen = true;
  }

  displayClose() {
    this.isDisplayOpen = false;
    this.changeForm.reset();
  }

  onChangeSubmit() {
    this.commonservice.presentLoading1();
    if (this.changeForm.valid) {
      const formData = this.changeForm.value;
      formData['crNo'] = this.singleCmfData.crNo;
      this.authservice.cmfdata(formData).then(
        (res: any) => {
          this.commonservice.showToast(
            'success',
            'Record Updated Successfully'
          );
          this.fetchCmf();
          this.changeForm.reset();
          this.isDisplayOpen = false;
          this.commonservice.loadingDismiss1();
        },
        (error) => {
          this.commonservice.showToast('error', error.error.msg);
          this.isDisplayOpen = false;
          this.commonservice.loadingDismiss1();
        }
      );
    }
  }
  onChangeReviewSubmit()
  {
    this.commonservice.presentLoading1();
    if (this.changeReviewForm.valid) {
      const formData = this.changeReviewForm.value;
      formData['crNo'] = this.singleCmfData.crNo;
      this.authservice.cmfdata(formData).then(
        (res: any) => {
          this.commonservice.showToast(
            'success',
            'Record Updated Successfully'
          );
          this.fetchCmf();
          this.changeReviewForm.reset();
          this.isDisplayOpen = false;
          this.commonservice.loadingDismiss1();
        },
        (error) => {
          this.commonservice.showToast('error', error.error.msg);
          this.isDisplayOpen = false;
          this.commonservice.loadingDismiss1();
        }
      );
    }
  }
  onChangeForwardSubmit()
  {
    this.commonservice.presentLoading1();

    if (this.changeForwardForm.valid) {
      const formData = this.changeForwardForm.value;
      formData['crNo'] = this.singleCmfData.crNo;
      this.authservice.cmfdata(formData).then(
        (res: any) => {
          this.commonservice.showToast(
            'success',
            'Record Updated Successfully'
          );
          this.fetchCmf();
          this.isDisplayOpen = false;
          this.commonservice.loadingDismiss1();
        },
        (error) => {
          this.commonservice.showToast('error', error.error.msg);
          this.isDisplayOpen = false;
          this.commonservice.loadingDismiss1();
        }
      );
    }
  }
}
