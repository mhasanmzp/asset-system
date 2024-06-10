import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-cv',
  templateUrl: './add-cv.page.html',
  styleUrls: ['./add-cv.page.scss'],
})
export class AddCVPage implements OnInit {
  
  personalDetailsForm: FormGroup;
  employeerDetailsForm: FormGroup;
  educationDetailsForm = {} as FormGroup;
  workExpDetailForm = {} as FormGroup;
  certificateDetailForm = {} as FormGroup;
  public tasks: FormArray;
  public tasksExp: FormArray;
  public tasksCertificate: FormArray;
  educationForm: any;
  image: any;
  organisationId: any;
  CountryCode: any = "+91";
  title: any = 'Mr.';
  CountryCodeOther: any = '+91';
  clearance: any = 'no';
  CurrencyCode: any = '$';
  salaryBasis: any = 'hour';
  taxTerm: any;
  response: any;
  uploadFile: boolean = false;
  uploadDL: boolean = false;
  uploadVisa: boolean = false;
  uploadResume: boolean = false;
  uploadC:any=[];
  workAuth = [
    {name:'H1B', id:'H1B'},
    {name:'L1-B', id:'L1-B'},
    {name:'L1-A', id:'L1-A'},
    {name:'L2 EAD', id:'L2EAD'},
    {name:'US Citizen', id:'USCitizen'},
    {name:'Green Card', id:'Green Card'},
    {name:'GC-EAD', id:'GC-EAD'},
    {name:'OPT-EAD', id:'OPT-EAD'},
    {name:'CPT', id:'CPT'},
    {name:'TN1', id:'TN1'},
    {name:'TN2', id:'TN2'},
    {name:'NeedH1', id:'Need H1'},
    {name:'Canadian Citizen', id:'CanadianCitizen'},
    {name:'H4-EAD', id:'H4-EAD'},
    {name:'E3', id:'E3'},
    {name:'EAD', id:'EAD'},
    {name:'NA', id:'NA'}
  ]

  constructor(private modalController: ModalController, private formBuilder: FormBuilder, private commonService: CommonService,
    private router: Router, private authService: AuthService) {
    this.educationDetailsForm = this.formBuilder.group({
      tasks: this.formBuilder.array([this.eduDetail()])
    });
    this.workExpDetailForm = this.formBuilder.group({
      tasksExp: this.formBuilder.array([this.workExpDetail()])
    });
    this.certificateDetailForm = this.formBuilder.group({
      tasksCertificate: this.formBuilder.array([this.certificateDetail()])
    });
  }

  ngOnInit() {
    this.form();
    this.authService.userLogin.subscribe((resp: any) => {
      this.organisationId = resp.organisationId
    });
  }

  form() {
    this.personalDetailsForm = this.formBuilder.group({
     
      fname: [''],
      lname: [''],
      dob: [''],
      currentSalary: [''],
      email: [''],
      alternateEmail: [''],
      phone: [''],
      otherPhone: [''],
      gender: [''],
      taxTerm: [''],
      linkedURL: [''],
      exceptedSalary: [''],
      workAuth: [''],
      expiry: [''],
      country: [''],
      city: [''],
      state: [''],
      zipCode: [''],
      yearExp: [''],
      monthExp: [''],
      primarySkill: [''],
      secondarySkill: [''],
      jobTitle: [''],
      currentCompany: [''],
      source: ['']
    });

    this.employeerDetailsForm = this.formBuilder.group({
      fname: [''],
      lname: [''],
      currentCompany: [''],
      email: [''],
      phone: [''],
      comment: [''],
      employeeType:['']
    })
  }

  eduDetail(): FormGroup {
    return this.formBuilder.group({
      degree: [''],
      major: [''],
      college: [''],
      location: [''],
      passYear: [''],
      percent: ['']
    })
  }
  get educational(): FormArray {
    return this.educationDetailsForm.get('tasks') as FormArray;
  }
  get eduGroups() { return this.educational.controls as FormGroup[]; }
  addEdu() {
    this.tasks = this.educationDetailsForm.get('tasks') as FormArray;
    this.tasks.push(this.eduDetail());
  }
  removeEdu(i: any) {
    if (this.tasks.length > 1) {
      this.tasks.removeAt(i);
    } else {
    }
  }

  workExpDetail(): FormGroup {
    return this.formBuilder.group({
      companyName: [''],
      jobTitle: [''],
      sDate: [''],
      eDate: ['']
    })
  }
  get workExp(): FormArray {
    return this.workExpDetailForm.get('tasksExp') as FormArray;
  }
  get workExpGroups() { return this.workExp.controls as FormGroup[]; }
  addWorkExp() {
    this.tasksExp = this.workExpDetailForm.get('tasksExp') as FormArray;
    this.tasksExp.push(this.workExpDetail());
  }
  removeWorkExp(i: any) {
    if (this.tasksExp.length > 1) {
      this.tasksExp.removeAt(i);
    } else {
    }
  }

  certificateDetail(): FormGroup {
    return this.formBuilder.group({
      certificateName: [''],
      completionYear: [''],
      upload: [''],
      uploadFile:false
    })
  }
  get certificate(): FormArray {
    return this.certificateDetailForm.get('tasksCertificate') as FormArray;
  }
  get certificateGroups() { return this.certificate.controls as FormGroup[]; }
  addCertificate() {
    this.tasksCertificate = this.certificateDetailForm.get('tasksCertificate') as FormArray;
    this.tasksCertificate.push(this.certificateDetail());
  }
  removeCertificate(i: any) {
    if (this.tasksCertificate.length > 1) {
      this.tasksCertificate.removeAt(i);
    } else {
    }
  }

  countryCode(event, data) {
    if (data == 'other') {
      this.CountryCodeOther = event.target.value
    } else {
      this.CountryCode = event.target.value;
    }
  }
  changeClearance(event) {
    this.clearance = event.target.value
  }
  changeSalary(event) {
    this.salaryBasis = event.target.value
  }
  currencyCode(event) {
    this.CurrencyCode = event.target.value
  }
  changeTitle(event) {
    this.title = event.target.value;
  }
  changeTax(event) {
    this.taxTerm = event.target.value
  }

  addCV() {
    let form = {
      document: {
        'drivingLicense': '',
        'visa': '',
        'resume': '',
        'otherDocument': ''
      },
      certification: this.certificateDetailForm.value.tasksCertificate,
      
    }
  }

  savePersonalDetails(){
    let form = {
      personalDetail: {
        'name': this.title + ' ' + this.personalDetailsForm.value.fname + ' ' + this.personalDetailsForm.value.lname,
        'email': this.personalDetailsForm.value.email,
        'alternateEmail': this.personalDetailsForm.value.email,
        'dob': this.personalDetailsForm.value.dob,
        'phone': this.CountryCode + this.personalDetailsForm.value.phone,
        'otherPhone': this.CountryCodeOther + this.personalDetailsForm.value.otherPhone,
        'gender': this.personalDetailsForm.value.gender,
        'country': this.personalDetailsForm.value.country,
        'city': this.personalDetailsForm.value.city,
        'state': this.personalDetailsForm.value.state,
        'zipCode': this.personalDetailsForm.value.zipCode,
        'currentSalary': this.CurrencyCode + ' ' + this.personalDetailsForm.value.currentSalary + ' ' + this.salaryBasis + ' ' + this.taxTerm,
        'exceptedSalary': this.CurrencyCode + ' ' + this.personalDetailsForm.value.exceptedSalary + ' ' + this.salaryBasis + ' ' + this.taxTerm,
        'primarySkill': this.personalDetailsForm.value.primarySkill,
        'secondarySkill': this.personalDetailsForm.value.secondarySkill,
        'jobTitle': this.personalDetailsForm.value.jobTitle,
        'currentCompany': this.personalDetailsForm.value.currentCompany,
        'taxTerm': this.personalDetailsForm.value.taxTerm,
        'linkedURL': this.personalDetailsForm.value.linkedURL,
        'workAuth': this.personalDetailsForm.value.workAuth,
        'expiry': this.personalDetailsForm.value.expiry,
        'yearExp': this.personalDetailsForm.value.yearExp,
        'monthExp': this.personalDetailsForm.value.monthExp,
        'source': this.personalDetailsForm.value.source,
        'clearance': this.clearance
      },
      employeerDetail: {
        'employeerName': this.title + ' ' + this.employeerDetailsForm.value.fname + ' ' + this.employeerDetailsForm.value.lname,
        'employeerCurrentCompany': this.employeerDetailsForm.value.currentCompany,
        'employeerEmail': this.employeerDetailsForm.value.email,
        'employeerPhone': this.CountryCode + this.employeerDetailsForm.value.phone,
        'employeerComment': this.employeerDetailsForm.value.comment,
        'employeeType': this.employeerDetailsForm.value.employeeType
      },
      "isFlag":1,
      "organisationId":this.authService.organisationId
    }
      this.commonService.addCVPool(form).then((res: any) => {
        if (res) {
          this.response = res;
          this.commonService.showToast("success", "CV added.")
        } else {
          this.commonService.showToast("error", "Something went wrong")
        }
      })
    
  }

  saveEducationDetails(){
    if(this.response?.id){
    let form = {
      'educationDetail': this.educationDetailsForm.value.tasks,
      "isFlag":2,
      'id':this.response.id
    }
    this.commonService.addCVPool(form).then((res: any) => {
      if (res) {
        this.commonService.showToast("success", "Data added.")
      } else {
        this.commonService.showToast("error", "Something went wrong")
      }
    })
  }else{
    this.commonService.showToast("error","Please submit personal details first.")
  }
  }

  saveWorkExpDetails(){
    if(this.response?.id){
    let form = {
      workExperience: this.workExpDetailForm.value.tasksExp,
      "isFlag":3,
      'id':this.response.id
    }
    this.commonService.addCVPool(form).then((res: any) => {
      if (res) {
        this.commonService.showToast("success", "Data added.")
      } else {
        this.commonService.showToast("error", "Something went wrong")
      }
    })
  }else{
    this.commonService.showToast("error","Please submit personal details first.")
  }
  }

  uploadDocument(event,name){
    let image = event.target.firstChild.files[0]
    if(image && this.response?.id){
      this.commonService.presentLoading();
      const formData = new FormData();
      formData.append("isFlag",'4')
      formData.append('id',this.response.id)
      formData.append("documentType",name)
      formData.append("file",image);
      this.commonService.addCVPool(formData).then((res:any) => {
        if(res){
          if(name == 'DL'){this.uploadDL = true;}
          else if(name == 'Visa'){this.uploadVisa = true;}
          else if(name == 'Resume'){this.uploadResume = true;}
          else{this.uploadFile = true;}
        }else{
          this.commonService.showToast("error","Something went wrong")
        }
      })
    }else{
      this.commonService.showToast("error","Please submit personal details first.")
    }
  }

  uploadCertificate(event,index){
    let image = event.target.firstChild.files[0]
    if(image && this.response?.id){
      this.commonService.presentLoading();
      const formData = new FormData();
      formData.append("isFlag",'4')
      formData.append('id',this.response.id)
      formData.append("documentType",'Certificate')
      formData.append("file",image);
      formData.append('certificateName',this.certificateDetailForm.value.tasksCertificate[index].certificateName)
      formData.append('completionYear',this.certificateDetailForm.value.tasksCertificate[index].completionYear)
      this.commonService.addCVPool(formData).then((res:any) => {
        if(res){
          this.uploadC[index] = true
        }else{
          this.commonService.showToast("error","Something went wrong")
        }
      })
    }else{
      this.commonService.showToast("error","Please submit personal details first.")
    }
  }

  addNew(){
   
    this.ngOnInit();
  }
  finalSubmit(){
    this.router.navigateByUrl('/ats')
  }
}
