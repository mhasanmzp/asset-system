import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { EChartsOption } from 'echarts';
import { ModalController } from '@ionic/angular';
import { ProjectTypeListPage } from 'src/app/modals/project-type-list/project-type-list.page';
import { CommonService } from '../../services/common.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-report',
  templateUrl: './project-report.component.html',
  styleUrls: ['./project-report.component.scss'],
})
export class ProjectReportComponent implements OnInit {
  allProjects: any;
  totalEst: any = 0;
  totalActual: any = 0;
  billableProject: any = [];
  nonBillableProject: any = [];
  chartOption: EChartsOption;
  chartOptionHours: EChartsOption;
  chartOptionProject: EChartsOption;
  chartOptionProjectHrs: EChartsOption;
  chartOptionProjectType: EChartsOption;
  isModalOpen: boolean = false;
  projectName: any;
  allProjectType: any;

  constructor(private projectService: ProjectService, public modalController: ModalController,
    private commonService: CommonService, private router: Router) { }

  ngOnInit() {
    this.allReport();
    this.getAllReport();
  }

  allReport() {
    this.projectService.getAllProjectHrs().then((resp: any) => {
      this.allProjects = resp;
      let actualHrs = [], estHours = [], projectName = [];
      this.allProjects.forEach(element => {
        this.totalEst += element.estHours;
        this.totalActual += element.actHurs;
        this.getProjectStatus(this.allProjects);
        this.getProjectType(this.allProjects);

        if (element.actHurs == null) {
          actualHrs.push(0);
        } else {
          actualHrs.push((element.actHurs).toFixed(2));
        }

        estHours.push((element.estHours).toFixed(2));
        projectName.push(element.projectName);
      });
      this.displayHoursChart(projectName, actualHrs, estHours);
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }
  getProjectStatus(project) {
    let upComing = [], onGoing = [], onHold = [], completed = [], suspended = [];
    let projectStatus = [];
    if (project.length > 0) {
      upComing = project.filter(task => task.projectStatus == 'Upcoming')
      projectStatus.push({ value: upComing.length, name: 'Upcoming' })
    }
    if (project.length > 0) {
      onHold = project.filter(task => task.projectStatus == 'Onhold')
      projectStatus.push({ value: onHold.length, name: 'Onhold' })
    }
    if (project.length > 0) {
      completed = project.filter(task => task.projectStatus == 'Completed')
      projectStatus.push({ value: completed.length, name: 'Completed' })
    }
    if (project.length > 0) {
      suspended = project.filter(task => task.projectStatus == 'Suspended')
      projectStatus.push({ value: suspended.length, name: 'Suspended' })
    }
    if (project.length > 0) {
      onGoing = project.filter(task => task.projectStatus == 'Ongoing')
      projectStatus.push({ value: onGoing.length, name: 'Ongoing' })
    }
    this.displayChart(projectStatus);
  }

  displayChart(data) {
    this.chartOption = {
      title: {
        text: 'All Project Status',
        left: 'center',
        textStyle: {
          color: '#747474'
        },
        padding: [0, 0, 50, 0]
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center',
        textStyle: {
          color: "#747474"
        }
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          data: data,
          color: ['#3498db', '#024877', '#27ae60', '#e74c3c', '#f1c40f'],
          tooltip: {
            backgroundColor: '#747474',
            textStyle: {
              color: '#fff'
            }
          }
        }
      ]
    };
  }

  displayHoursChart(name, actual, planned) {
    this.chartOptionHours = {
      title: {
        text: 'Effort by Hours Report',
        left: 'center',
        textStyle: {
          color: '#747474'
        },
        padding: [0, 0, 50, 0]
      },
      tooltip: {
        backgroundColor: '#747474',
        textStyle: {
          color: '#fff'
        },
        trigger: 'axis',
        axisPointer: { type: 'cross' },
      },
      legend: {
        data: ['Planned Hours', 'Actual Hours'],
        top: '5%',
        left: 'center',
        textStyle: {
          color: "#747474"
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: name,
        axisLabel: { interval: 0, rotate: 90 }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Planned Hours',
          type: 'line',
          data: planned,
          color: 'red'
        },
        {
          name: 'Actual Hours',
          type: 'line',
          data: actual,
          color: 'green'
        }
      ]
    };
  }

  getAllReport() {
    this.projectService.getallprojectDetails().then((resp: any) => {
      let toDo = [], inProgress = [], done = [], hold = [], testing = [], projectName = [];
      let toDoTask = [], inProgressTask = [], doneTask = [], holdTask = [], testingTask = [], projectNameTask = [];
      let toDoHrs = [], inProgressHrs = [], doneHrs = [], holdHrs = [], testingHrs = [];
      resp.forEach(ele => {
        projectName.push(ele[0].projectName);
        toDo.push(ele.filter(e => { return e.columnName === 'To Do' }))
        inProgress.push(ele.filter(e => { return e.columnName === 'In Progress' }))
        done.push(ele.filter(e => { return e.columnName === 'Done' }))
        hold.push(ele.filter(e => { return e.columnName === 'Hold' }))
        testing.push(ele.filter(e => { return e.columnName === 'Testing' }))
      });
      for (let i = 0; i < resp.length; i++) {
        toDoHrs.push(toDo[i][0]?.estHours ? (toDo[i][0].estHours).toFixed(2) : 0);
        inProgressHrs.push(inProgress[i][0]?.estHours ? (inProgress[i][0].estHours).toFixed(2) : 0);
        doneHrs.push(done[i][0]?.estHours ? (done[i][0].estHours).toFixed(2) : 0);
        holdHrs.push(hold[i][0]?.estHours ? (hold[i][0].estHours).toFixed(2) : 0);
        testingHrs.push(testing[i][0]?.estHours ? (testing[i][0].estHours).toFixed(2) : 0);

        toDoTask.push(toDo[i][0]?.counts ? toDo[i][0].counts : 0);
        inProgressTask.push(inProgress[i][0]?.counts ? inProgress[i][0].counts : 0);
        doneTask.push(done[i][0]?.counts ? done[i][0].counts : 0);
        holdTask.push(hold[i][0]?.counts ? hold[i][0].counts : 0);
        testingTask.push(testing[i][0]?.counts ? testing[i][0].counts : 0);
      }
      this.displayLineChart(projectName, toDoTask, inProgressTask, doneTask, holdTask, testingTask);
      this.displayBarChartHours(projectName, toDoHrs, inProgressHrs, doneHrs, holdHrs, testingHrs)
    }, error => {
      this.commonService.showToast('error', error.error)
    })
  }

  displayLineChart(name, toDo, inProgress, done, hold, testing) {
    this.chartOptionProject = {
      title: {
        text: "Report of tasks in projects",
        left: 'center',
        textStyle: {
          color: '#747474'
        },
        padding: [0, 0, 50, 0]
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        backgroundColor: '#747474',
        textStyle: {
          color: '#fff'
        }
      },
      legend: {
        top: '5%',
        left: 'center',
        textStyle: {
          color: "#747474"
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      yAxis: {
        type: 'value'
      },
      xAxis: {
        type: 'category',
        data: name,
        axisLabel: { interval: 0, rotate: 90 }
      },
      series: [
        {
          name: 'To Do',
          type: 'line',
          data: toDo
        },
        {
          name: 'In Progress',
          type: 'line',
          data: inProgress
        },
        {
          name: 'Done',
          type: 'line',
          data: done
        },
        {
          name: 'Hold',
          type: 'line',
          data: hold
        },
        {
          name: 'Testing',
          type: 'line',
          data: testing
        }
      ],
      color: ['#e74c3c', '#f1c40f', '#27ae60', '#024877', '#3498db'],
    };
  }

  displayBarChartHours(name, toDoHrs, inProgressHrs, doneHrs, holdHrs, testingHrs) {
    this.chartOptionProjectHrs = {
      title: {
        text: "Report of task's hours in projects",
        left: 'center',
        textStyle: {
          color: '#747474'
        },
        padding: [0, 0, 50, 0]
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        backgroundColor: '#747474',
        textStyle: {
          color: '#fff'
        }
      },
      legend: {
        top: '5%',
        left: 'center',
        textStyle: {
          color: "#747474"
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      yAxis: {
        type: 'value'
      },
      xAxis: {
        type: 'category',
        data: name,
        axisLabel: { interval: 0, rotate: 90 }
      },
      series: [
        {
          name: 'To Do',
          type: 'bar',
          stack: 'total',
          data: toDoHrs
        },
        {
          name: 'In Progress',
          type: 'bar',
          stack: 'total',
          data: inProgressHrs
        },
        {
          name: 'Done',
          type: 'line',
          data: doneHrs
        },
        {
          name: 'Hold',
          type: 'bar',
          stack: 'total',
          data: holdHrs
        },
        {
          name: 'Testing',
          type: 'bar',
          stack: 'total',
          data: testingHrs
        }
      ],
      color: ['#e74c3c', '#f1c40f', '#27ae60', '#024877', '#3498db'],
    };
  }

  getProjectType(project) {
    let projectType = [];
    if (project.length > 0) {
      this.billableProject = project.filter(task => task.projectType == "Billable")
      projectType.push({ value: this.billableProject.length, name: "Billable" })
    }
    if (project.length > 0) {
      this.nonBillableProject = project.filter(task => task.projectType == "Non-Billable")
      projectType.push({ value: this.nonBillableProject.length, name: "Non-Billable" })
    }
    this.displayProjectType(projectType);
  }

  onChartInit(data) {
    let status;
    data.on('click', (params) => {
      status = params.data.name;
      if (status == "Billable") {
        this.projectName = "Billable";
        this.allProjectType = this.billableProject;
      } else if (status == "Non-Billable") {
        this.projectName = "Non-Billable";
        this.allProjectType = this.nonBillableProject;
      }
    })
  }

  displayProjectType(data) {
    this.chartOptionProjectType = {
      title: {
        text: 'All Project Type',
        left: 'center',
        textStyle: {
          color: '#747474'
        },
        padding: [0, 0, 50, 0]
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center',
        textStyle: {
          color: "#747474"
        }
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          data: data,
          color: ['#3498db', '#024877'],
          tooltip: {
            backgroundColor: '#747474',
            textStyle: {
              color: '#fff'
            }
          }
        }
      ]
    };
  }

  async setOpen() {
    const popover = await this.modalController.create({
      component: ProjectTypeListPage,
      cssClass: 'notes-modal',
      componentProps: {
        projectName: this.projectName,
        projectList: this.allProjectType
      },
      showBackdrop: true
    });
    await popover.present();
    popover.onDidDismiss().then(resp => {

    })
  }

}
