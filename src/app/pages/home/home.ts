import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, forkJoin, catchError, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DashboardService, DashboardStats } from '../../core/services/dashboard.service';
import { ProjectsService, Project } from '../../core/services/projects.service';
import { TasksService, Task } from '../../core/services/tasks.service';
import { UsersService } from '../../core/services/users.service';
import { AlertsService, Alert } from '../../core/services/alerts.service';
import { NotificationsService } from '../../core/services/notifications.service';

export interface RecentActivity {
  _id: string;
  type: 'project_created' | 'task_completed' | 'resource_assigned' | 'material_updated' | 'project_updated';
  title: string;
  description: string;
  timestamp: Date;
  entityId?: string;
  userId?: string;
  userName?: string;
}

export interface UpcomingTask {
  _id: string;
  name: string;
  dueDate: Date;
  progress: number;
  status: string;
  projectName?: string;
  assignedResources?: string[];
}

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private dashboardService = inject(DashboardService);
  private projectsService = inject(ProjectsService);
  private tasksService = inject(TasksService);
  private usersService = inject(UsersService);
  private alertsService = inject(AlertsService);
  private notificationsService = inject(NotificationsService);

  // Dashboard stats
  totalRevenue: number = 0;
  activeProjects: number = 0;
  teamMembers: number = 0;
  
  // Recent activities
  recentActivities: RecentActivity[] = [];
  
  // Upcoming tasks
  upcomingTasks: UpcomingTask[] = [];
  
  // System alerts
  systemAlerts: Alert[] = [];
  
  // Loading states
  isLoadingStats = true;
  isLoadingActivities = true;
  isLoadingTasks = true;
  isLoadingAlerts = true;
  
  // Error states
  hasStatsError = false;
  hasActivitiesError = false;
  hasTasksError = false;
  hasAlertsError = false;

  ngOnInit() {
    this.loadDashboardData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboardData(): void {
    // Load all dashboard data in parallel
    forkJoin({
      stats: this.dashboardService.getStats().pipe(catchError(() => of(null))),
      projects: this.projectsService.getProjects({ page: 1, limit: 50 }).pipe(catchError(() => of(null))),
      users: this.usersService.getUsers({ page: 1, limit: 200 }).pipe(catchError(() => of(null))),
      recentActivities: this.dashboardService.getRecentActivities(5).pipe(catchError(() => of([]))),
      upcomingTasks: this.tasksService.getTasks({ 
        page: 1, 
        limit: 10, 
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Next 7 days
      }).pipe(catchError(() => of(null))),
      alerts: this.alertsService.getCriticalAlerts().pipe(catchError(() => of([])))
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        this.processDashboardData(data);
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.setLoadingStates(false);
        this.hasStatsError = true;
        this.hasActivitiesError = true;
        this.hasTasksError = true;
        this.hasAlertsError = true;
      }
    });
  }

  private processDashboardData(data: any): void {
    // Process stats
    this.hasStatsError = false;
    if (data.stats) {
      this.processStats(data.stats);
    } else if (data.projects && data.users) {
      // Fallback: calculate stats from projects and users data
      this.calculateStatsFromData(data.projects, data.users);
    } else {
      this.hasStatsError = true;
    }
    this.isLoadingStats = false;

    // Process recent activities
    this.hasActivitiesError = false;
    try {
      this.recentActivities = this.processRecentActivities(data.recentActivities || []);
    } catch (error) {
      console.error('Error processing activities:', error);
      this.hasActivitiesError = true;
      this.recentActivities = [];
    }
    this.isLoadingActivities = false;

    // Process upcoming tasks
    this.hasTasksError = false;
    try {
      if (data.upcomingTasks?.tasks) {
        this.upcomingTasks = this.processUpcomingTasks(data.upcomingTasks.tasks);
      } else {
        this.hasTasksError = true;
      }
    } catch (error) {
      console.error('Error processing tasks:', error);
      this.hasTasksError = true;
      this.upcomingTasks = [];
    }
    this.isLoadingTasks = false;

    // Process alerts
    this.hasAlertsError = false;
    try {
      this.systemAlerts = data.alerts || [];
    } catch (error) {
      console.error('Error processing alerts:', error);
      this.hasAlertsError = true;
      this.systemAlerts = [];
    }
    this.isLoadingAlerts = false;
  }

  private processStats(stats: DashboardStats): void {
    this.activeProjects = stats.activeProjects || 0;
    this.teamMembers = stats.availableResources || 0; // Using available resources as team members
    
    // Use actual revenue from stats if available
    this.totalRevenue = 0; // Will be calculated from actual project data or provided by stats
  }

  private calculateStatsFromData(projectsData: any, usersData: any): void {
    if (projectsData?.projects) {
      this.activeProjects = projectsData.projects.filter((p: Project) => p.isOpen).length;
      
      // Calculate total revenue from active projects
      this.totalRevenue = projectsData.projects
        .filter((p: Project) => p.isOpen)
        .reduce((sum: number, p: Project) => sum + (p.invoiceAmount || 0), 0);
    }
    
    if (usersData?.total) {
      this.teamMembers = usersData.total;
    }
  }

  private processRecentActivities(activities: any[]): RecentActivity[] {
    return activities.map(activity => ({
      _id: activity._id || activity.id,
      type: activity.type || 'project_updated',
      title: activity.title || this.getActivityTitle(activity.type),
      description: activity.description || activity.message,
      timestamp: new Date(activity.timestamp || activity.createdAt),
      entityId: activity.entityId,
      userId: activity.userId,
      userName: activity.userName
    })).slice(0, 5); // Limit to 5 most recent
  }

  private processUpcomingTasks(tasks: Task[]): UpcomingTask[] {
    return tasks
      .filter(task => task.status !== 'Completed' && new Date(task.dueDate) > new Date())
      .map(task => ({
        _id: task._id,
        name: task.name,
        dueDate: new Date(task.dueDate),
        progress: task.progress,
        status: task.status,
        assignedResources: task.resourceIds
      }))
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .slice(0, 5); // Limit to 5 upcoming tasks
  }

  private getActivityTitle(type: string): string {
    switch (type) {
      case 'project_created': return 'New Project Created';
      case 'task_completed': return 'Task Completed';
      case 'resource_assigned': return 'Resource Assigned';
      case 'material_updated': return 'Material Updated';
      case 'project_updated': return 'Project Updated';
      default: return 'System Activity';
    }
  }

  private setLoadingStates(loading: boolean): void {
    this.isLoadingStats = loading;
    this.isLoadingActivities = loading;
    this.isLoadingTasks = loading;
    this.isLoadingAlerts = loading;
    
    if (loading) {
      // Reset error states when starting to load
      this.hasStatsError = false;
      this.hasActivitiesError = false;
      this.hasTasksError = false;
      this.hasAlertsError = false;
    }
  }

  // Template helper methods
  trackByAlertId(index: number, alert: Alert): string {
    return `${alert.id}-${index}`;
  }

  trackByActivityId(index: number, activity: RecentActivity): string {
    return `${activity._id}-${index}`;
  }

  trackByTaskId(index: number, task: UpcomingTask): string {
    return `${task._id}-${index}`;
  }

  getAlertIcon(type: string): string {
    switch (type) {
      case 'low-stock':
      case 'critical-stock':
        return 'fa-boxes-stacked';
      case 'maintenance':
        return 'fa-wrench';
      case 'task-overdue':
        return 'fa-clock';
      default:
        return 'fa-circle-exclamation';
    }
  }

  getActivityColor(type: string): string {
    switch (type) {
      case 'project_created': return '#28a745';
      case 'task_completed': return '#007bff';
      case 'resource_assigned': return '#fd7e14';
      case 'material_updated': return '#6f42c1';
      case 'project_updated': return '#17a2b8';
      default: return '#f39512';
    }
  }

  getAlertColor(severity: string): string {
    switch (severity) {
      case 'high': return '#dc3545';
      case 'medium': return '#fd7e14';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(timestamp).getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }

  getDaysUntilDue(dueDate: Date): number {
    const now = new Date();
    const due = new Date(dueDate);
    const diffInMs = due.getTime() - now.getTime();
    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  }

  getTaskPriorityClass(daysUntil: number): string {
    if (daysUntil < 0) return 'overdue';
    if (daysUntil <= 1) return 'urgent';
    if (daysUntil <= 3) return 'high';
    return 'normal';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
  }

  refreshData(): void {
    this.setLoadingStates(true);
    this.loadDashboardData();
  }
}
