import { Component } from '@angular/core';
import { CommonService } from './services/common.service';
import { AuthService } from './services/auth.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { EmployeeProfilePage } from './pages/employee-profile/employee-profile.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  allTicketData: any;
  organisationId: any;
  user: any = {};
  public modules: any = [];
  public appPages = [
    // {
    //   title: 'Dashboard',
    //   url: 'dashboard',
    //   icon: 'bar-chart',
    //   permission: 'Dashboard',
    // },
   
    
  
    
   
    {
      title: 'Employee List',
      url: 'employee-list',
      icon: 'people',
      permission: 'EmployeeList',
    },
 
  
   
    // { title: 'My Tasks', url: 'tasks', icon: 'list', permission: 'Tasks' },
   

    {
      title: 'Fixed Asset Tracking',
      url: 'asset',
      icon: 'grid',
      permission: 'Leaves',
    },

    // {
    //   title: 'Staffing Forecasting',
    //   url: 'staffing-forecasting',
    //   icon: 'people',
    //   permission: 'Leaves',
    // },


   
  
   
  




    // {
    //   title: 'Teams',
    //   url: 'teams',
    //   icon: 'people-circle',
    //   permission: 'Teams',
    // },
    // {
    //   title: 'My Leaves',
    //   url: 'leaves',
    //   icon: 'calendar',
    //   permission: 'Leaves',
    // },
    // {
    //   title: 'View All Leaves',
    //   url: 'view-all-leave',
    //   icon: 'calendar',
    //   permission: 'ViewAllLeave',
    // },
    // {
    //   title: 'View All Logs',
    //   url: 'view-log',
    //   icon: 'document',
    //   permission: 'ViewAllLog',
    // },
    // {
    //   title: 'Leave Report',
    //   url: 'all-user-leave-admin',
    //   icon: 'calendar',
    //   permission: 'LeaveReport',
    // },
    // {
    //   title: 'Expenses',
    //   url: 'expenses',
    //   icon: 'cash',
    //   permission: 'Expenses',
    // },
    // {
    //   title: 'ATS/CV Pool',
    //   url: 'ats',
    //   icon: 'file-tray-full',
    //   permission: 'ATSCVPool',
    // },
    // {
    //   title: 'Inventory',
    //   url: 'inventory',
    //   icon: 'information-circle',
    //   permission: 'Inventory',
    // },
    // {
    //   title: 'Grievance',
    //   url: 'tickets',
    //   icon: 'information-circle',
    //   permission: 'Tickets',
    // },
    // {
    //   title: 'User Groups',
    //   url: 'user-groups',
    //   icon: 'albums',
    //   permission: 'UserGroups',
    // },

    // { title: 'View All KRA', url: 'view-all-kra', icon: 'eye', permission: 'ViewAllKRA'},
    // { title: 'Profile', url: 'profile', icon: 'person' },
    // { title: 'Settings', url: 'settings', icon: 'settings' },
  ];
  public salesPages = [{ title: 'Customers', url: 'sales/customers' }];
  public PMO = [
    { title: 'Monthly Costing', url: 'pmo/monthlyconsting' },
    { title: 'Capacity', url: 'pmo/capacity' },
  ];

  salesPermission: boolean = false;
  constructor(
    public commonService: CommonService,
    public modalController: ModalController,
    public menuController: MenuController,
    public router: Router,
    public authService: AuthService
  ) {
    let userId = localStorage.getItem('userId');

    if (userId) {
      this.getAllTicketData();
      this.getTicketData();
    }

    let type = localStorage.getItem('type');
    if (!type) localStorage.setItem('type', 'employee');
    this.menuController.enable(false);
    if (userId) {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          let url = event.url.split('/')[1];

          if (event.url == '/') {
            this.router.navigate(['/dashboard']);
          }
        }
      });
      this.setupPermissions(userId);
    } else {
      this.router.navigate(['/login']);
    }

    this.authService.userLogin.subscribe((resp: any) => {
      if (resp && resp.userId) {
        this.setupPermissions(resp.userId);
      }
    });
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    toggleDarkTheme(prefersDark.matches);

    prefersDark.addListener((mediaQuery) =>
      toggleDarkTheme(mediaQuery.matches)
    );

    function toggleDarkTheme(shouldAdd) {
      document.body.classList.toggle('dark', shouldAdd);
    }
    this.organisationId = localStorage.getItem('organisationId');
    console.log(this.organisationId);
  }

  setupPermissions(userId) {
    let type = localStorage.getItem('type');

    this.authService.getUserDetails(userId, type).then((data: any) => {
      if (data) {
        this.user = data;
        this.modules = [];
        if (type == 'customer') {
          this.router.navigate(['/client-dashboard']);
        } else {
          let permissions = data['modules'];
          if (permissions) {
            this.appPages.forEach((module) => {
              if (permissions[module.permission]) this.modules.push(module);
            });
            if (permissions['Sales']) this.salesPermission = true;
          } else {
            this.modules = this.appPages;
          }

          if (this.router.url == '/login') this.router.navigate(['/dashboard']);
        }
      }
    });
  }

  async openProfile() {
    const popover = await this.modalController.create({
      component: EmployeeProfilePage,
      cssClass: 'profile-modal',
      showBackdrop: true,
    });
    await popover.present();
  }

  openChat() {
    this.router.navigate(['/chatrooms']);
  }

  logout() {
    localStorage.clear();
    this.allTicketData=[];

    this.router.navigate(['/login'], { replaceUrl: true });
  }

  getAllTicketData() {
    this.allTicketData=[];

    let userId = +localStorage.getItem('userId');
    this.commonService
      .getAllGrievance({
        employeeId: userId,
        employeeIdMiddleware: userId,
        permissionName: 'Dashboard',
      })
      .then(
        (res: any) => {
          if (res.length > 0) {
            this.allTicketData = res.filter((item: any) => {
              return item.status == 'New';
            }).length;
          }else{
            this.allTicketData=[];
          }
        },
        (error) => {
          this.commonService.showToast('error', error.error);
        }
      );
  }

  getTicketData() {
    this.commonService.ticket.subscribe((data) => {
      this.allTicketData = data;
      console.log(this.allTicketData)
    });
  }
}
