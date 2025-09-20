import { Component } from '@angular/core';
import {NgSelectComponent} from '@ng-select/ng-select';
import {Resource} from '../../models/resource';
import {StatusHeader} from '../../components/status-header/status-header';
import {TaskCard} from '../../components/task-card/task-card';
import {Project} from '../../models/project';
import {NgForOf, CommonModule} from '@angular/common';
import {Piece} from '../../models/piece';
import {Task} from '../../models/task';
import {FormsModule} from '@angular/forms';
import {Comment} from '../../models/comment';
import {TaskDetailDialog} from '../../components/task-detail-dialog/task-detail-dialog';

@Component({
  selector: 'app-to-do-list',
  imports: [
    CommonModule,
    NgSelectComponent,
    StatusHeader,
    TaskCard,
    NgForOf,
    FormsModule,
    TaskDetailDialog
  ],
  templateUrl: './to-do-list.html',
  styleUrl: './to-do-list.scss'
})
export class ToDoList {

  selectedResourceId: string | null = null;
  toDoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  completedTasks: Task[] = [];
  onHoldTasks: Task[] = [];

  // Dialog properties
  isDialogVisible: boolean = false;
  selectedTask: Task | null = null;
  selectedTaskComments: Comment[] = [];
  selectedProject: Project | null = null;

  projects: Project[] = [];

  resources: Resource[] = [];

  pieces: Piece[] = [];

  tasks: Task[] = [];

  comments: Comment[] = [
  ];


  updateTasksByResource(selectedResourceId: string) {
    const tasksForResource = this.tasks.filter(task =>
      task.resourceIds.includes(selectedResourceId)
    );
    this.toDoTasks = tasksForResource.filter(task => task.status === 'To Do');
    this.inProgressTasks = tasksForResource.filter(task => task.status === 'In Progress');
    this.completedTasks = tasksForResource.filter(task => task.status === 'Completed');
    this.onHoldTasks = tasksForResource.filter(task => task.status === 'On Hold');
  }

  openTaskDialog(task: Task) {
    this.selectedTask = task;
    this.selectedTaskComments = this.comments.filter(comment => comment.taskId === task._id);
    this.selectedProject = this.findProjectForTask(task);
    this.isDialogVisible = true;
  }

  findProjectForTask(task: Task): Project | null {
    // Find the piece that contains this task
    const piece = this.pieces.find(piece => piece.taskIds.includes(task._id));
    if (!piece) return null;
    
    // Find the project that contains this piece
    return this.projects.find(project => project.pieceIds.includes(piece._id)) || null;
  }

  closeTaskDialog() {
    this.isDialogVisible = false;
    this.selectedTask = null;
    this.selectedTaskComments = [];
    this.selectedProject = null;
  }

  addComment(commentText: string) {
    if (this.selectedTask) {
      const newComment: Comment = {
        _id: `cm${this.comments.length + 1}`,
        taskId: this.selectedTask._id,
        authorId: this.selectedResourceId || 'r1', // Use selected resource or default
        message: commentText,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      this.comments.push(newComment);
      this.selectedTaskComments = this.comments.filter(comment => comment.taskId === this.selectedTask!._id);

      // Update the task's comment count
      const task = this.tasks.find(t => t._id === this.selectedTask!._id);
      if (task) {
        task.commentIds.push(newComment._id);
      }
    }
  }

  updateTaskQuantity(event: {taskId: string, producedQuantity: number}) {
    const task = this.tasks.find(t => t._id === event.taskId);
    if (task) {
      // Find the piece that contains this task
      const piece = this.pieces.find(p => p.taskIds.includes(event.taskId));
      if (piece) {
        // Calculate new progress based on produced quantity
        const newProgress = Math.min(100, Math.round((event.producedQuantity / piece.quantity) * 100));
        task.progress = newProgress;
        
        // Update piece progress if this task represents the main work
        piece.progress = newProgress;
        
        // Update status based on progress
        if (newProgress === 100) {
          task.status = 'Completed';
          piece.status = 'Completed';
        } else if (newProgress > 0) {
          task.status = 'In Progress';
          piece.status = 'In Progress';
        }
      }
      
      // Re-filter tasks to update the UI
      if (this.selectedResourceId) {
        this.updateTasksByResource(this.selectedResourceId);
      }
    }
  }

  // Helper methods to get piece information
  getPieceName(pieceId: string): string {
    const piece = this.pieces.find(p => p._id === pieceId);
    return piece ? piece.name : '';
  }

  getPieceReference(pieceId: string): string {
    const piece = this.pieces.find(p => p._id === pieceId);
    return piece ? piece.reference : '';
  }
}
