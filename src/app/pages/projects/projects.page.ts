import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { AuthService } from '../../services/auth.service';
import { ProjectService } from '../../services/project.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
})
export class ProjectsPage implements OnInit {
  allProjects: any = [];
  allProjectsArray: any = [];
  private subscription: Subscription;

  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private projectService: ProjectService,
    public router: Router) { }
  segment: any = 'Ongoing';

  ngOnInit() {
    this.fetchEmployee();
  }

  ionViewWillEnter() {
    // this.subscription = this.authService.userLogin.subscribe(resp => {
    //   // debugger;
    //   if (resp && Object.keys(resp).length > 0)
    //     this.fetchEmployee();
    // })
  }

  ionViewWillLeave() {
    // this.subscription.unsubscribe();
  }

  fetchEmployee() {
    let formData = {
      organisationId: localStorage.getItem("organisationId")
    }
    this.projectService.fetchAllProjects(formData).then((resp: any) => {
      this.allProjectsArray = resp;
      this.allProjects = this.allProjectsArray.filter(p => p.projectStatus == this.segment)
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  statusChanged($event) {
    this.allProjects = this.allProjectsArray.filter(p => p.projectStatus == this.segment)
  }

  openProject(request: any) {
    this.router.navigate(['/project-details/' + request.projectId]);
  }

  searchProject(event) {
    let project = event.target.value;
    if (project) {
      this.allProjects = project ? this.allProjectsArray.filter(e => (e.projectName.toLowerCase().includes(project.toLowerCase()) || e.projectName.toUpperCase().includes(project.toUpperCase()) || e.projectName.includes(project))) : '';
    } else {
      this.allProjects = this.allProjectsArray
    }
  }
}
