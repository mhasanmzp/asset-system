import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  token: any;
  header: any;
  jwt_token: any;

  apiUrl1:any ='https://4b86-103-204-170-81.ngrok-free.app/';
  constructor(public authService: AuthService, public http: HttpClient) {
    this.jwt_token = localStorage.getItem('jwt_token');
    this.header = new HttpHeaders().set('jwt_token', this.jwt_token);
  }

  createProject(projectObject) {
    projectObject.organisationId = this.authService.organisationId;
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.authService.apiUrl + 'createProject', projectObject, {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  updateProject(projectObject) {
    projectObject.organisationId = this.authService.organisationId;
    return new Promise((resolve, reject) => {
      this.http
        .post(this.authService.apiUrl + 'updateProject', projectObject)
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getOneProject(paramsData) {
    paramsData.organisationId = this.authService.organisationId;
    return new Promise((resolve, reject) => {
      this.http
        .post(this.authService.apiUrl + 'getOneProject', paramsData)
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getProjectMembers(paramsData) {
    paramsData.organisationId = this.authService.organisationId;
    return new Promise((resolve, reject) => {
      this.http
        .post(this.authService.apiUrl + 'getProjectMembers', paramsData)
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  addProjectMember(paramsData) {
    paramsData.organisationId = this.authService.organisationId;
    return new Promise((resolve, reject) => {
      this.http
        .post(this.authService.apiUrl + 'addProjectMember', paramsData)
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  removeProjectMember(paramsData) {
    paramsData.organisationId = this.authService.organisationId;
    return new Promise((resolve, reject) => {
      this.http
        .post(this.authService.apiUrl + 'removeProjectMember', paramsData)
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  updateProjectMember(paramsData) {
    paramsData.organisationId = this.authService.organisationId;
    return new Promise((resolve, reject) => {
      this.http
        .post(this.authService.apiUrl + 'updateProjectMember', paramsData)
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  fetchAllProjects(paramsData) {
    paramsData.organisationId = this.authService.organisationId;
    return new Promise((resolve, reject) => {
      this.http
        .post(this.authService.apiUrl + 'fetchAllProjects', paramsData)
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getMemberProjects() {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.authService.apiUrl + 'getMemberProjects', {
          employeeId: localStorage.getItem("userId"),
        },{
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getTeamsReporting() {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.authService.apiUrl + 'getTeamsReporting', {
          userId: this.authService.userId,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  createEpic(epicData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.authService.apiUrl + 'createEpic', epicData)
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getProjectData(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.authService.apiUrl + 'getProjectData', data)
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  updateProjectEpic(epicData) {
    let newEpic = Object.assign(epicData);
    if (typeof newEpic.id != 'number')
      newEpic['id'] = newEpic.id.replace('epic', '');
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'epicUpdate', newEpic).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getProjectEpics(epicData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.authService.apiUrl + 'getProjectEpics', epicData)
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  deleteProjectEpics(epicData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.authService.apiUrl + 'deleteEpic', epicData)
        .subscribe((resp: any) => {
          resolve(resp);
        }),
        (error) => {
          reject(error);
        };
    });
  }

  createStory(epicData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.authService.apiUrl + 'createStory', epicData)
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  updateEpicStory(epicData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.authService.apiUrl + 'storyUpdate', epicData)
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getEpicStories(epicData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.authService.apiUrl + 'getStories', epicData)
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
 
  // new Api for user tickets
  getUserTicket(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.authService.apiUrl + 'getTasksForEpicManager', data)

      
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  // new Api for user tickets

  getUserComments(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.authService.apiUrl + 'getTaskComments', data)
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  updateUserComments(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.authService.apiUrl + 'addTaskComments', data)
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  deleteEpicStory(epicData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.authService.apiUrl + 'deleteStory', epicData)
        .subscribe((resp: any) => {
          resolve(resp);
        }),
        (error) => {
          reject(error);
        };
    });
  }

  createStoryTask(taskData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.authService.apiUrl + 'createStoryTask', taskData).subscribe(
        (resp: any) => {
          resolve(resp);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getStoryTasks(epicData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.authService.apiUrl + 'getStoryTasks', epicData)
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getProjectColumns(projectData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.authService.apiUrl + 'getProjectColumns', projectData)
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  updateProjectTask(task) {
    return new Promise((resolve, reject) => {
      task.organisationId = this.authService.organisationId;
      this.http
        .post(this.authService.apiUrl + 'updateProjectTask', task)
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  fetchAllDocs(paramsData) {
    paramsData.employeeId = this.authService.employeeId;
    return new Promise((resolve, reject) => {
      this.http
        .post(this.authService.apiUrl + 'getoneEmployeeDocument', paramsData)
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  createSprint(taskData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.authService.apiUrl + 'createSprint', taskData)
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getActiveSprints(projectId) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.authService.apiUrl + 'getActiveSprints', { projectId })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getInactiveSprints(projectId) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.authService.apiUrl + 'getInactiveSprints', { projectId })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getPastSprints(projectId) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.authService.apiUrl + 'getPastSprints', { projectId })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  updateSprint(sprint) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.authService.apiUrl + 'updateSprint', sprint)
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getAllProjectReport(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.authService.apiUrl + 'getAllProjectReport', data)
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getAllProjectHrs() {
    return new Promise((resolve, reject) => {
      let organisationId = this.authService.organisationId;
      this.http
        .post(this.authService.apiUrl + 'getAllProjectHrs', { organisationId })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getallprojectDetails() {
    return new Promise((resolve, reject) => {
      let organisationId = this.authService.organisationId;
      this.http
        .post(this.authService.apiUrl + 'getallprojectwholedetails', {
          organisationId,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  async downloadSprint(sprint) {
    let url =
      this.authService.apiUrl +
      'downloadSprint' +
      '?sprintId=' +
      sprint.sprintId +
      '&tasks=' +
      sprint.tasks;
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        Jwt_token: localStorage.getItem('jwt_token'),
      },
    });
    let blob = await response.blob();
    let filename = 'Downloaded_Sprint.xlsx'; // Provide appropriate filename
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // window.location.assign(
    //   this.authService.apiUrl +
    //   'downloadSprint' +
    //   '?sprintId=' +
    //   sprint.sprintId +
    //   '&tasks=' +
    //   sprint.tasks
    // );
  }

  // release Functionality by  ankit
  getReleaseNumbers(projectId: any) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.authService.apiUrl + 'getReleaseNumber', projectId, {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getReleaseNumberTasks() {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .get(this.authService.apiUrl + 'getReleaseNumberForOrganisation', {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getReleaseNumberTasksData(data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.append('jwt_token', this.jwt_token);
      headers = headers.append('ngrok-skip-browser-warning', 'Hakuna Matata');
      this.http
        .post(this.authService.apiUrl + 'getSprintsAccReleaseNumber', data, {
          headers: headers,
        })
        .subscribe(
          (resp: any) => {
            resolve(resp);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  // release Functionality by  ankit
}
