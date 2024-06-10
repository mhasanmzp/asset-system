import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assigned-ticket',
  templateUrl: './assigned-ticket.component.html',
  styleUrls: ['./assigned-ticket.component.scss'],
})
export class AssignedTicketComponent implements OnInit {
  isModalOpen = false;
  resolution: any;
  status: any;
  updateForm: FormGroup;
  allTicketData: any;
  allNewTicketData: any;
  selectedRowData: any;
  commentArray: any = [];
  offset = 0;
  segment: any = 'All'

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllTicketData();
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  getAllTicketData() {
    this.commonService.presentLoading();

    let userId = +localStorage.getItem('userId');

    this.commonService.getAllGrievance({ employeeId: userId, offset: this.offset, status: this.status }).then(
      (res: any) => {
        this.allTicketData = res;
        this.offset += 20;
      },
      (error) => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login');
        }
      }
    );
  }

  getMoreData(event)
  {
    let userId = +localStorage.getItem('userId');

    this.commonService.getAllGrievance({ employeeId: userId, offset: this.offset,status: this.status }).then(
      (res: any) => {
        this.allTicketData = this.allTicketData.concat(res);
        this.offset += 20;
        if(event)
        event.target.complete();
      },
      (error) => {
        this.commonService.showToast('error', error.error.msg);
        if(event)
        event.target.complete();
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login');
        }
      }
    );
  }

  onTableClick(rowData: any) {
    this.selectedRowData = rowData;
    this.commentArray = rowData.getComments;

    this.isModalOpen = true;
  }

  onSubmit() {
    this.commonService.presentLoading();

    let userId = +localStorage.getItem('userId');


    if (typeof this.selectedRowData.getComments == 'string') {
      this.selectedRowData.getComments = [];
    }
    if (this.selectedRowData.more_comment) {
      this.selectedRowData.getComments.push({
        empId: userId,
        comment: this.selectedRowData.more_comment,
        empName: this.selectedRowData.employeeName,
      });
    }
    this.selectedRowData.comments = this.selectedRowData.getComments;
    this.selectedRowData.getComments == '';

    this.commonService.updateTicketData(this.selectedRowData).then(
      (resp) => {
        this.isModalOpen = false;
        this.commonService.showToast('success', 'Data Updated Successfully');

        this.getAllNewTicketData();

        this.getAllTicketData();
      },
      (error) => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login');
        }
      }
    );
  }

  getAllNewTicketData() {
    this.commonService.presentLoading();

    let userId = +localStorage.getItem('userId');

    this.commonService.getAllGrievance({ employeeId: userId }).then(
      (res: any) => {
        console.table('response', res);
        this.allNewTicketData = res.filter((item) => {
          return item.status === 'New';
        }).length;

        this.commonService.setTicket(this.allNewTicketData);
      },
      (error) => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login');
        }
      }
    );
  }

  segmentChanged(ev)
  {
    this.offset = 0
    this.status = ev.target.value; 
    this.allTicketData = []
    if(this.status == 'All')
    this.status = null;
    this.getAllTicketData();
  }
}
