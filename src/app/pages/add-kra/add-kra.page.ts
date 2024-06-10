import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-kra',
  templateUrl: './add-kra.page.html',
  styleUrls: ['./add-kra.page.scss'],
})
export class AddKraPage implements OnInit {
  KAR_header = [
    { title: 'Designation', index: 'Designation' },
    { title: 'Division', index: 'Division' },
    { title: 'Career Level', index: 'CarrierLevel' },
    { title: 'Manager Name', index: 'ManagerName' },
    { title: 'Employee Name', index: 'EmployeeName' },
    { title: 'Joining Date', index: 'JoiningDate' },
    { title: 'Department', index: 'Department' },
    { title: 'Review Period(in Days)', index: 'ReviewPeriod' },
    { title: 'Evaluation Purpose', index: 'EvaluationPurpose' }
  ];
  KRA_Rating = [
    { title: 'KRA Score', required: true },
    { title: 'Taget Score', required: false },
    { title: 'KPI Score', required: false },
    { title: 'Actual Score', required: false },
    { title: 'Final Rating', required: false }
  ];
  KRA_Footer = [
    { title: "Evaluator's Name", index: "EvaluatorName" },
    { title: "Director's Name", index: "DirectorName" },
  ]

  skill = 'TECHNICAL SKILLS';
  designation: any = [];
  totalScore: any;
  kraForm = {} as FormGroup;
  kraAdministratForm = {} as FormGroup;
  kraManagerialForm = {} as FormGroup;
  kraAllProgressForm = {} as FormGroup;
  kraScoringForm = {} as FormGroup;
  public tasks: FormArray;
  public administratTasks: FormArray;
  public managerialTasks: FormArray;
  public allProgressTasks: FormArray;
  public scoringTasks: FormArray;
  recommendation: any;
  comment: any;
  evaluation: any = [];
  organisationId: any;
  employeeId: any;
  months: any = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];
  monthNew: any = [];
  month: any;
  month1: any;
  year: any;
  years: any[];
  Months: any;
  technicalRating: any = 0;
  administratRating: any = 0;
  managerialRating: any = 0;
  allProgressRating: any = 0;
  scoringRating: any = 0;
  private subscription: Subscription;

  constructor(private fb: FormBuilder, private authService: AuthService,
    private commonService: CommonService, private router: Router) {
    this.kraForm = this.fb.group({
      tasks: this.fb.array([this.createTask()])
    });
    this.kraAdministratForm = this.fb.group({
      administratTasks: this.fb.array([this.createAdministratTask()])
    });
    this.kraManagerialForm = this.fb.group({
      managerialTasks: this.fb.array([this.createManagerialTask()])
    });
    this.kraAllProgressForm = this.fb.group({
      allProgressTasks: this.fb.array([this.createAllProgressTask()])
    });
    this.kraScoringForm = this.fb.group({
      scoringTasks: this.fb.array([this.createScoringTask()])
    });
  }

  ngOnInit() {
    this.subscription = this.authService.userLogin.subscribe((resp: any) => {
      this.employeeId = resp.employeeId;
      this.organisationId = resp.organisationId;
      if (resp) {
        this.commonService.getOneEmployee({ employeeId: this.employeeId }).then((res: any) => {
          if (res) {
            this.designation.JoiningDate = res[0].DOJ;
            this.designation.Designation = res[0].designation;
            if (res[0].middleName) {
              this.designation.EmployeeName = res[0].firstName + ' ' + res[0].middleName + ' ' + res[0].lastName
            } else {
              this.designation.EmployeeName = res[0].firstName + ' ' + res[0].lastName
            }
          }
        })
      }
    })
    this.Months = JSON.parse(localStorage.getItem('Months'))
    let date = new Date();
    this.month1 = date.getMonth() + 1;
    this.month = date.getMonth() + 1;

    var year = new Date().getFullYear();
    this.years = [];
    for (var i = year - 1; i <= year; i++) {
      this.years.push(i)
    }
  }

  createTask(): FormGroup {
    return this.fb.group({
      kra: [''],
      kraScore: [''],
      tScore: [''],
      kpiScore: [''],
      aScore: [''],
      fRating: [''],
      review: [''],
    });
  }
  get employees(): FormArray {
    return this.kraForm.get('tasks') as FormArray;
  }
  get kraGroups() { return this.employees.controls as FormGroup[]; }
  addSkill() {
    this.tasks = this.kraForm.get('tasks') as FormArray;
    this.tasks.push(this.createTask());
    this.TechnicalRating('');
  }
  removeSkill(i: any) {
    if (this.tasks.length > 1) {
      this.tasks.removeAt(i);
    } else {
    }
    this.TechnicalRating('');
  }
  TechnicalRating(event) {
    if (this.tasks) {
      this.technicalRating = 0;
      this.tasks?.value.forEach(element => {
        this.technicalRating += (+element.kraScore)
      });
    } else {
      this.technicalRating = event.target.value
    }
    if (this.technicalRating > 100) {
      this.commonService.showToast("error", "Technical rating must be 100")
    }
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  createAdministratTask(): FormGroup {
    return this.fb.group({
      kraAdministrat: [''],
      kraScoreAdministrat: [''],
      tScoreAdministrat: [''],
      kpiScoreAdministrat: [''],
      aScoreAdministrat: [''],
      fRatingAdministrat: [''],
      reviewAdministrat: [''],
    });
  }
  get administratEmployees(): FormArray {
    return this.kraAdministratForm.get('administratTasks') as FormArray;
  }
  get kraAdministratGroups() { return this.administratEmployees.controls as FormGroup[]; }
  addAdministratSkill() {
    this.administratTasks = this.kraAdministratForm.get('administratTasks') as FormArray;
    this.administratTasks.push(this.createAdministratTask());
    this.AdministratRating('');
  }
  removeAdministratSkill(i: any) {
    if (this.administratTasks.length > 1) {
      this.administratTasks.removeAt(i);
    } else {
    }
    this.AdministratRating('');
  }
  AdministratRating(event) {
    if (this.administratTasks) {
      this.administratRating = 0;
      this.administratTasks?.value.forEach(element => {
        this.administratRating += (+element.kraScoreAdministrat)
      });
    } else {
      this.administratRating = event.target.value
    }
    if (this.administratRating > 100) {
      this.commonService.showToast("error", "Administration rating must be 100")
    }
  }

  createManagerialTask(): FormGroup {
    return this.fb.group({
      kraManagerial: [''],
      kraScoreManagerial: [''],
      tScoreManagerial: [''],
      kpiScoreManagerial: [''],
      aScoreManagerial: [''],
      fRatingManagerial: [''],
      reviewManagerial: [''],
    });
  }
  get managerialEmployees(): FormArray {
    return this.kraManagerialForm.get('managerialTasks') as FormArray;
  }
  get kraManagerialGroups() { return this.managerialEmployees.controls as FormGroup[]; }
  addManagerialSkill() {
    this.managerialTasks = this.kraManagerialForm.get('managerialTasks') as FormArray;
    this.managerialTasks.push(this.createManagerialTask());
    this.ManagerialRating('');
  }
  removeManagerialSkill(i: any) {
    if (this.managerialTasks.length > 1) {
      this.managerialTasks.removeAt(i);
    } else {
    }
    this.ManagerialRating('');
  }
  ManagerialRating(event) {
    if (this.managerialTasks) {
      this.managerialRating = 0;
      this.managerialTasks?.value.forEach(element => {
        this.managerialRating += (+element.kraScoreManagerial)
      });
    } else {
      this.managerialRating = event.target.value
    }
    if (this.managerialRating > 100) {
      this.commonService.showToast("error", "Managerial rating must be 100")
    }
  }

  createAllProgressTask(): FormGroup {
    return this.fb.group({
      kraAllProgress: [''],
      kraScoreAllProgress: [''],
      tScoreAllProgress: [''],
      kpiScoreAllProgress: [''],
      aScoreAllProgress: [''],
      fRatingAllProgress: [''],
      reviewAllProgress: [''],
    });
  }
  get allProgressEmployees(): FormArray {
    return this.kraAllProgressForm.get('allProgressTasks') as FormArray;
  }
  get kraAllProgressGroups() { return this.allProgressEmployees.controls as FormGroup[]; }
  addAllProgressSkill() {
    this.allProgressTasks = this.kraAllProgressForm.get('allProgressTasks') as FormArray;
    this.allProgressTasks.push(this.createAllProgressTask());
    this.AllProgressRating('');
  }
  removeAllProgressSkill(i: any) {
    if (this.allProgressTasks.length > 1) {
      this.allProgressTasks.removeAt(i);
    } else {
    }
    this.AllProgressRating('');
  }
  AllProgressRating(event) {
    if (this.allProgressTasks) {
      this.allProgressRating = 0;
      this.allProgressTasks?.value.forEach(element => {
        this.allProgressRating += (+element.kraScoreAllProgress)
      });
    } else {
      this.allProgressRating = event.target.value
    }
    if (this.allProgressRating > 100) {
      this.commonService.showToast("error", "All-progress rating must be 100")
    }
  }

  createScoringTask(): FormGroup {
    return this.fb.group({
      attribute: [''],
      score: [''],
    });
  }
  get scoringEmployees(): FormArray {
    return this.kraScoringForm.get('scoringTasks') as FormArray;
  }
  get kraScoringGroups() { return this.scoringEmployees.controls as FormGroup[]; }
  addScoringSkill() {
    this.scoringTasks = this.kraScoringForm.get('scoringTasks') as FormArray;
    this.scoringTasks.push(this.createScoringTask());
    this.ScoringRating('');
  }
  removeScoringSkill(i: any) {
    if (this.scoringTasks.length > 1) {
      this.scoringTasks.removeAt(i);
    } else {
    }
    this.ScoringRating('');
  }
  ScoringRating(event) {
    if (this.scoringTasks) {
      this.scoringRating = 0;
      this.scoringTasks?.value.forEach(element => {
        this.scoringRating += (+element.score)
      });
    } else {
      this.scoringRating = event.target.value
    }
    if (this.scoringRating > 10) {
      this.commonService.showToast("error", "Score rating must be 10")
    }
  }

  submitKRA() {
    let monthName;
    for (let i = 0; i < this.months.length; i++) {
      if (this.month == this.months[i].value) {
        monthName = this.months[i].name
      }
    }
      if (this.technicalRating == 100 && this.administratRating == 100 && this.managerialRating == 100 && this.allProgressRating == 100) {
        let form = {
          employeeId: this.employeeId,
          organisationId: this.organisationId,
          TotalScore: this.totalScore,
          Designation: this.designation.Designation,
          Division: this.designation.Division,
          CarrierLevel: this.designation.CarrierLevel,
          ManagerName: this.designation.ManagerName,
          employeeName: this.designation.EmployeeName,
          JoiningDate: this.designation.JoiningDate,
          Department: this.designation.Department,
          ReviewPeriod: +this.designation.ReviewPeriod,
          EvaluationPurpose: this.designation.EvaluationPurpose,
          TechnicalSkill: this.kraForm.value.tasks,
          AdministrationSkill: this.kraAdministratForm.value.administratTasks,
          ManagerialSkill: this.kraManagerialForm.value.managerialTasks,
          AllProgress: this.kraAllProgressForm.value.allProgressTasks,
          ScoringSystem: this.kraScoringForm.value.scoringTasks,
          Recommendation: this.recommendation,
          Comment: this.comment,
          EvaluatorName: this.evaluation.EvaluatorName,
          DirectorName: this.evaluation.DirectorName,
          month: monthName,
          year: +this.year
        }
        this.commonService.createKRA(form).then((res: any) => {
          if (res.kraId) {
            this.commonService.showToast("success", "Creation Successful!");
            this.router.navigateByUrl('/performance')
          }
        }, error => {
          this.commonService.showToast("error", "Something went wrong!")
        })
      } else {
        this.commonService.showToast("error", "KRA score of each skill will be 100")
      }

   
  }
  selectYear(ev) {
    this.monthNew = JSON.parse(JSON.stringify(this.months))
    this.Months?.forEach(element => {
      this.monthNew.splice(this.monthNew.findIndex(item => (item.name === element.month) && (element.year == ev.target.value)), 1)
    });
  }

}
