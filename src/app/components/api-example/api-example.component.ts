import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { 
  AuthService, 
  ProjectsService, 
  TasksService, 
  DashboardService,
  WebSocketService,
  LoadingService,
  NotificationsService,
  User,
  DashboardStats,
  ProjectsResponse,
  TasksResponse
} from '../../core';

@Component({
  selector: 'app-api-example',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="api-example">
      <h2>API Integration Example</h2>
      
      <!-- Loading Indicator -->
      <div *ngIf="loading$ | async" class="loading">
        Loading...
      </div>

      <!-- Authentication Status -->
      <div class="auth-status">
        <p>Authentication Status: {{ isAuthenticated ? 'Authenticated' : 'Not Authenticated' }}</p>
        <p *ngIf="currentUser">Welcome, {{ currentUser.firstName }} {{ currentUser.lastName }}!</p>
      </div>

      <!-- Dashboard Stats -->
      <div class="dashboard" *ngIf="dashboardStats">
        <h3>Dashboard Statistics</h3>
        <ul>
          <li>Total Projects: {{ dashboardStats.totalProjects }}</li>
          <li>Active Projects: {{ dashboardStats.activeProjects }}</li>
          <li>Completed Tasks: {{ dashboardStats.completedTasks }}</li>
          <li>Pending Tasks: {{ dashboardStats.pendingTasks }}</li>
          <li>Available Resources: {{ dashboardStats.availableResources }}</li>
          <li>Low Stock Materials: {{ dashboardStats.lowStockMaterials }}</li>
          <li>Critical Alerts: {{ dashboardStats.criticalAlerts }}</li>
        </ul>
      </div>

      <!-- Projects List -->
      <div class="projects" *ngIf="projects.length > 0">
        <h3>Recent Projects</h3>
        <ul>
          <li *ngFor="let project of projects">
            {{ project.name }} - Progress: {{ project.progress }}%
          </li>
        </ul>
      </div>

      <!-- Real-time Updates -->
      <div class="realtime-updates">
        <h3>Real-time Updates</h3>
        <p>WebSocket Connected: {{ isWebSocketConnected ? 'Yes' : 'No' }}</p>
        <div *ngIf="lastUpdate">
          Last Update: {{ lastUpdate | json }}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="actions">
        <button (click)="loadDashboardData()">Refresh Dashboard</button>
        <button (click)="loadProjects()">Load Projects</button>
        <button (click)="loadTasks()">Load Tasks</button>
        <button (click)="testWebSocket()">Test WebSocket</button>
      </div>
    </div>
  `,
  styles: [`
    .api-example {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .loading {
      text-align: center;
      font-weight: bold;
      color: #007bff;
    }

    .auth-status, .dashboard, .projects, .realtime-updates {
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }

    .actions {
      margin: 20px 0;
    }

    .actions button {
      margin: 5px;
      padding: 10px 15px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    }

    .actions button:hover {
      background-color: #0056b3;
    }

    ul {
      list-style-type: disc;
      margin-left: 20px;
    }
  `]
})
export class ApiExampleComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  currentUser: User | null = null;
  dashboardStats: DashboardStats | null = null;
  projects: any[] = [];
  tasks: any[] = [];
  isWebSocketConnected = false;
  lastUpdate: any = null;
  loading$;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private projectsService: ProjectsService,
    private tasksService: TasksService,
    private dashboardService: DashboardService,
    private webSocketService: WebSocketService,
    private loadingService: LoadingService,
    private notificationsService: NotificationsService
  ) {
    this.loading$ = this.loadingService.loading$;
  }

  ngOnInit(): void {
    this.initializeComponent();
    this.setupWebSocketListeners();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initializeComponent(): void {
    // Check authentication status
    this.isAuthenticated = this.authService.isAuthenticated();
    
    // Subscribe to current user
    this.subscriptions.push(
      this.authService.currentUser$.subscribe((user: User | null) => {
        this.currentUser = user;
      })
    );

    // Load initial data if authenticated
    if (this.isAuthenticated) {
      this.loadDashboardData();
      this.loadProjects();
    }
  }

  private setupWebSocketListeners(): void {
    this.isWebSocketConnected = this.webSocketService.isConnected();

    // Listen for task updates
    this.subscriptions.push(
      this.webSocketService.getTaskUpdates().subscribe((update: any) => {
        console.log('Task update received:', update);
        this.lastUpdate = { type: 'task', data: update };
      })
    );

    // Listen for notifications
    this.subscriptions.push(
      this.webSocketService.getNotifications().subscribe((notification: any) => {
        console.log('Notification received:', notification);
        this.lastUpdate = { type: 'notification', data: notification };
      })
    );

    // Listen for alerts
    this.subscriptions.push(
      this.webSocketService.getAlerts().subscribe((alert: any) => {
        console.log('Alert received:', alert);
        this.lastUpdate = { type: 'alert', data: alert };
      })
    );

    // Listen for material updates
    this.subscriptions.push(
      this.webSocketService.getMaterialUpdates().subscribe((update: any) => {
        console.log('Material update received:', update);
        this.lastUpdate = { type: 'material', data: update };
      })
    );
  }

  loadDashboardData(): void {
    this.subscriptions.push(
      this.dashboardService.getStats().subscribe({
        next: (stats: DashboardStats) => {
          this.dashboardStats = stats;
          console.log('Dashboard stats loaded:', stats);
        },
        error: (error: any) => {
          console.error('Error loading dashboard stats:', error);
        }
      })
    );
  }

  loadProjects(): void {
    this.subscriptions.push(
      this.projectsService.getProjects({ page: 1, limit: 5 }).subscribe({
        next: (response: ProjectsResponse) => {
          this.projects = response.projects;
          console.log('Projects loaded:', response);
        },
        error: (error: any) => {
          console.error('Error loading projects:', error);
        }
      })
    );
  }

  loadTasks(): void {
    this.subscriptions.push(
      this.tasksService.getTasks({ page: 1, limit: 10 }).subscribe({
        next: (response: TasksResponse) => {
          this.tasks = response.tasks;
          console.log('Tasks loaded:', response);
        },
        error: (error: any) => {
          console.error('Error loading tasks:', error);
        }
      })
    );
  }

  testWebSocket(): void {
    if (this.webSocketService.isConnected()) {
      console.log('WebSocket is connected');
      // Join a test room
      this.webSocketService.joinRoom('test-room');
    } else {
      console.log('WebSocket is not connected, attempting to reconnect...');
      this.webSocketService.reconnect();
      setTimeout(() => {
        this.isWebSocketConnected = this.webSocketService.isConnected();
      }, 1000);
    }
  }
}
