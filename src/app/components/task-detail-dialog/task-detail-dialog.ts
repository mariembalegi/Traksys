import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task';
import { Comment } from '../../models/comment';
import { Resource } from '../../models/resource';
import { Piece } from '../../models/piece';

@Component({
  selector: 'app-task-detail-dialog',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-detail-dialog.html',
  styleUrl: './task-detail-dialog.scss'
})
export class TaskDetailDialog implements OnInit, OnDestroy {
  @Input() task!: Task | null;
  @Input() comments: Comment[] = [];
  @Input() resources: Resource[] = [];
  @Input() pieces: Piece[] = [];
  @Input() isVisible: boolean = false;
  @Input() currentResourceId: string = 'r1'; // Current user's resource ID
  @Output() closeDialog = new EventEmitter<void>();
  @Output() addComment = new EventEmitter<string>();
  @Output() updateQuantity = new EventEmitter<{taskId: string, producedQuantity: number}>();

  newCommentText: string = '';
  elapsedTime: number = 0;
  isTimerRunning: boolean = false;
  private timerInterval?: number;
  
  // Quantity tracking
  producedQuantity: number = 0;
  totalQuantity: number = 0;
  piece: Piece | null = null;
  private previousQuantity: number = 0;

  constructor() {}

  ngOnInit() {
    if (this.task) {
      this.elapsedTime = this.task.spentTime || 0;
      this.initializeQuantityTracking();
    }
  }

  initializeQuantityTracking() {
    if (this.task && this.pieces.length > 0) {
      // Find the piece that contains this task
      this.piece = this.pieces.find(piece => 
        piece.taskIds.includes(this.task!.id)
      ) || null;
      
      if (this.piece) {
        this.totalQuantity = this.piece.quantity;
        // Calculate produced quantity based on task progress and piece quantity
        this.producedQuantity = Math.floor((this.task.progress / 100) * this.totalQuantity);
        this.previousQuantity = this.producedQuantity; // Track initial quantity
      }
    }
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  close() {
    this.closeDialog.emit();
  }

  startTimer() {
    if (!this.isTimerRunning) {
      this.isTimerRunning = true;
      this.timerInterval = window.setInterval(() => {
        this.elapsedTime += 1/3600; // Add 1 second in hours
      }, 1000);
    }
  }

  stopTimer() {
    if (this.isTimerRunning) {
      this.isTimerRunning = false;
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
    }
  }

  submitComment() {
    if (this.newCommentText.trim() && this.task) {
      this.addComment.emit(this.newCommentText.trim());
      this.newCommentText = '';
    }
  }

  getResourceName(resourceId: string): string {
    const resource = this.resources.find(r => r.id === resourceId);
    return resource ? resource.name : 'Unknown';
  }

  getTaskResourceNames(): string {
    if (!this.task || !this.task.resourceIds || this.task.resourceIds.length === 0) {
      return 'No resources assigned';
    }
    
    const resourceNames = this.task.resourceIds.map(id => this.getResourceName(id));
    return resourceNames.join(', ');
  }

  formatTime(hours: number): string {
    const totalMinutes = Math.floor(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    const s = Math.floor((hours * 3600) % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  getTimeProgressPercentage(): number {
    if (!this.task || this.task.estimatedTime === 0) return 0;
    // Use only elapsed time (total time spent including current session)
    return Math.round((this.elapsedTime / this.task.estimatedTime) * 100);
  }

  getTimeProgressColor(): string {
    const percentage = this.getTimeProgressPercentage();
    if (percentage <= 100) return '#57d670'; // Green - on track
    if (percentage <= 120) return '#f9803e'; // Orange - slightly over
    return '#FF4136'; // Red - significantly over
  }

  getSessionTime(): number {
    return this.elapsedTime;
  }

  getRemainingTime(): number {
    if (!this.task) return 0;
    return this.task.estimatedTime - this.elapsedTime;
  }

  getEfficiency(): number {
    if (!this.task || this.task.estimatedTime === 0) return 0;
    return Math.round((this.task.estimatedTime / this.elapsedTime) * 100);
  }

  getAbsoluteRemainingTime(): number {
    return Math.abs(this.getRemainingTime());
  }

  getProgressBarColor(): string {
    if (!this.task) return '#6c757d';
    const progress = this.calculateProgress();
    if (progress >= 75) return '#57d670'; // Green from your home page
    if (progress >= 50) return '#f9803e';  // Orange from your home page  
    if (progress >= 25) return '#8e6cf4';  // Purple from your home page
    return '#FF4136'; // Red from your project
  }

  getStatusColor(): string {
    if (!this.task) return '#6c757d';
    switch (this.task.status) {
      case 'Completed': return '#57d670';
      case 'In Progress': return '#005eff'; // Blue from your home page
      case 'On Hold': return '#f9803e';
      case 'To Do': return '#6c757d';
      default: return '#6c757d';
    }
  }

  calculateProgress(): number {
    if (this.totalQuantity === 0) return 0;
    return Math.min(100, Math.round((this.producedQuantity / this.totalQuantity) * 100));
  }

  onQuantityChange() {
    if (this.task && this.producedQuantity >= 0 && this.producedQuantity <= this.totalQuantity) {
      // Update previous quantity
      this.previousQuantity = this.producedQuantity;
      
      const newProgress = this.calculateProgress();
      this.updateQuantity.emit({
        taskId: this.task.id,
        producedQuantity: this.producedQuantity
      });
    }
  }

  incrementQuantity() {
    if (this.producedQuantity < this.totalQuantity) {
      this.producedQuantity++;
      this.onQuantityChange();
    }
  }

  decrementQuantity() {
    if (this.producedQuantity > 0) {
      this.producedQuantity--;
      this.onQuantityChange();
    }
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
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
}
