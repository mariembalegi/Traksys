import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Services
import { BaseApiService } from './services/base-api.service';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { CustomersService } from './services/customers.service';
import { ProjectsService } from './services/projects.service';
import { TasksService } from './services/tasks.service';
import { PiecesService } from './services/pieces.service';
import { ResourcesService } from './services/resources.service';
import { MaterialsService } from './services/materials.service';
import { CommentsService } from './services/comments.service';
import { NotificationsService } from './services/notifications.service';
import { AlertsService } from './services/alerts.service';
import { DashboardService } from './services/dashboard.service';
import { ReportsService } from './services/reports.service';
import { UploadService } from './services/upload.service';
import { WebSocketService } from './services/websocket.service';
import { LoadingService } from './services/loading.service';

// Interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LoadingInterceptor } from './interceptors/loading.interceptor';

// Guards
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    // Services
    BaseApiService,
    AuthService,
    UsersService,
    CustomersService,
    ProjectsService,
    TasksService,
    PiecesService,
    ResourcesService,
    MaterialsService,
    CommentsService,
    NotificationsService,
    AlertsService,
    DashboardService,
    ReportsService,
    UploadService,
    WebSocketService,
    LoadingService,
    
    // Guards
    AuthGuard,
    
    // Interceptors
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it only once in the AppModule.');
    }
  }
}
