import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: Socket | undefined;
  private taskUpdatesSubject = new Subject<any>();
  private notificationsSubject = new Subject<any>();
  private alertsSubject = new Subject<any>();
  private materialUpdatesSubject = new Subject<any>();
  private resourceUpdatesSubject = new Subject<any>();
  private projectUpdatesSubject = new Subject<any>();

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket(): void {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.warn('No authentication token found, skipping WebSocket connection');
      return;
    }

    this.socket = io(environment.wsUrl, {
      auth: {
        token
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('task:updated', (data) => {
      this.taskUpdatesSubject.next(data);
    });

    this.socket.on('notification:new', (data) => {
      this.notificationsSubject.next(data);
    });

    this.socket.on('alert:new', (data) => {
      this.alertsSubject.next(data);
    });

    this.socket.on('material:stock-updated', (data) => {
      this.materialUpdatesSubject.next(data);
    });

    this.socket.on('resource:updated', (data) => {
      this.resourceUpdatesSubject.next(data);
    });

    this.socket.on('project:updated', (data) => {
      this.projectUpdatesSubject.next(data);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });
  }

  // Observable streams for real-time updates
  getTaskUpdates(): Observable<any> {
    return this.taskUpdatesSubject.asObservable();
  }

  getNotifications(): Observable<any> {
    return this.notificationsSubject.asObservable();
  }

  getAlerts(): Observable<any> {
    return this.alertsSubject.asObservable();
  }

  getMaterialUpdates(): Observable<any> {
    return this.materialUpdatesSubject.asObservable();
  }

  getResourceUpdates(): Observable<any> {
    return this.resourceUpdatesSubject.asObservable();
  }

  getProjectUpdates(): Observable<any> {
    return this.projectUpdatesSubject.asObservable();
  }

  // Emit events to server
  joinRoom(roomId: string): void {
    if (this.socket) {
      this.socket.emit('join-room', roomId);
    }
  }

  leaveRoom(roomId: string): void {
    if (this.socket) {
      this.socket.emit('leave-room', roomId);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  reconnect(): void {
    this.disconnect();
    this.initializeSocket();
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}
