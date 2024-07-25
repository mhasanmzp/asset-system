import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./auth/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./pages/dashboard/dashboard.module').then(
        (m) => m.DashboardPageModule
      ),
  },
  {
    path: 'employee-list',
    loadChildren: () =>
      import('./pages/employee-list/employee-list.module').then(
        (m) => m.EmployeeListPageModule
      ),
  },

  {
    path: 'tasks',
    loadChildren: () =>
      import('./pages/tasks/tasks.module').then((m) => m.TasksPageModule),
  },
  {
    path: 'projects',
    loadChildren: () =>
      import('./pages/projects/projects.module').then(
        (m) => m.ProjectsPageModule
      ),
  },

  {
    path: 'project-details/:id',
    loadChildren: () =>
      import('./pages/project-details/project-details.module').then(
        (m) => m.ProjectDetailsPageModule
      ),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./pages/settings/settings.module').then(
        (m) => m.SettingsPageModule
      ),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./pages/profile/profile.module').then((m) => m.ProfilePageModule),
  },

  {
    path: 'employee-onboarding/:id',
    loadChildren: () =>
      import('./pages/employee-onboarding/employee-onboarding.module').then(
        (m) => m.EmployeeOnboardingPageModule
      ),
  },
  {
    path: 'project-manage/:id',
    loadChildren: () =>
      import('./pages/project-manage/project-manage.module').then(
        (m) => m.ProjectManagePageModule
      ),
  },

  {
    path: 'employee-profile',
    loadChildren: () =>
      import('./pages/employee-profile/employee-profile.module').then(
        (m) => m.EmployeeProfilePageModule
      ),
  },
  {
    path: 'project-task-details',
    loadChildren: () =>
      import('./modals/project-task-details/project-task-details.module').then(
        (m) => m.ProjectTaskDetailsPageModule
      ),
  },
  {
    path: 'project-epic-details',
    loadChildren: () =>
      import('./modals/project-epic-details/project-epic-details.module').then(
        (m) => m.ProjectEpicDetailsPageModule
      ),
  },
  {
    path: 'project-story-details',
    loadChildren: () =>
      import(
        './modals/project-story-details/project-story-details.module'
      ).then((m) => m.ProjectStoryDetailsPageModule),
  },

  {
    path: 'add-kra',
    loadChildren: () =>
      import('./pages/add-kra/add-kra.module').then((m) => m.AddKraPageModule),
  },
  {
    path: 'add-note',
    loadChildren: () =>
      import('./modals/add-note/add-note.module').then(
        (m) => m.AddNotePageModule
      ),
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./auth/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordPageModule
      ),
  },
  {
    path: 'change-password',
    loadChildren: () =>
      import('./modals/change-password/change-password.module').then(
        (m) => m.ChangePasswordPageModule
      ),
  },
  {
    path: 'notifications',
    loadChildren: () =>
      import('./pages/notifications/notifications.module').then(
        (m) => m.NotificationsPageModule
      ),
  },
  {
    path: 'project-sprint-details',
    loadChildren: () =>
      import(
        './modals/project-sprint-details/project-sprint-details.module'
      ).then((m) => m.ProjectSprintDetailsPageModule),
  },

  {
    path: 'chatrooms',
    loadChildren: () =>
      import('./pages/chatrooms/chatrooms.module').then(
        (m) => m.ChatroomsPageModule
      ),
  },
  {
    path: 'ats',
    loadChildren: () =>
      import('./pages/ats/ats.module').then((m) => m.AtsPageModule),
  },
  {
    path: 'add-cv',
    loadChildren: () =>
      import('./pages/ats/add-cv/add-cv.module').then((m) => m.AddCVPageModule),
  },

  {
    path: 'project-chart-list',
    loadChildren: () =>
      import('./modals/project-chart-list/project-chart-list.module').then(
        (m) => m.ProjectChartListPageModule
      ),
  },
  {
    path: 'project-type-list',
    loadChildren: () =>
      import('./modals/project-type-list/project-type-list.module').then(
        (m) => m.ProjectTypeListPageModule
      ),
  },

  {
    path: 'grn',
    loadChildren: () => import('./pages/grn/grn.module').then(m => m.GrnPageModule)
  },
  {
    path: 'delivery',
    loadChildren: () => import('./pages/delivery/delivery.module').then(m => m.DeliveryPageModule)
  },


  {
    path: 'add-comments',
    loadChildren: () =>
      import('./modals/add-comments/add-comments.module').then(
        (m) => m.AddCommentsPageModule
      ),
  },
  {
    path: 'asset-grid-view',
    loadChildren: () => import('./pages/asset-grid-view/asset-grid-view.module').then( m => m.AssetGridViewPageModule)
  },
  {
    path: 'scrap-management',
    loadChildren: () => import('./pages/scrap-management/scrap-management.module').then( m => m.ScrapManagementPageModule)
  },
  {
    path: 'asset',
    loadChildren: () => import('./pages/fixed-asset/asset.module').then( m => m.AssetPageModule)
  },
{
  path: 'faulty-product',
  loadChildren: () => import('./pages/faulty-product/faulty-product.module').then(m => m.FaultyProductPageModule)
},
  {
    path: 'asset-grid-view',
    loadChildren: () => import('./pages/asset-grid-view/asset-grid-view.module').then( m => m.AssetGridViewPageModule)
  },
  {
    path: 'quality-assurance',
    loadChildren: () => import('./pages/quality-assurance/quality-assurance.module').then( m => m.QualityAssurancePageModule)
  },
  {
    path: 'staffing-forecasting',
    loadChildren: () => import('./pages/staffing-forecasting/staffing-forecasting.module').then( m => m.StaffingForecastingPageModule)
  },
  {
    path: 'staffing-report',
    loadChildren: () => import('./pages/staffing-report/staffing-report.module').then( m => m.StaffingReportPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
