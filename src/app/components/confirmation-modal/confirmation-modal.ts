import { Component, inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';

export interface ConfirmationData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="confirmation-modal">
      <div class="modal-header" [ngClass]="'header-' + (data.type || 'danger')">
        <h3>{{ data.title }}</h3>
      </div>
      
      <div class="modal-body">
        <p>{{ data.message }}</p>
      </div>
      
      <div class="modal-footer">
        <button 
          type="button" 
          class="btn btn-secondary" 
          (click)="onCancel()">
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button 
          type="button" 
          class="btn" 
          [ngClass]="'btn-' + (data.type || 'danger')" 
          (click)="onConfirm()">
          {{ data.confirmText || 'Confirm' }}
        </button>
      </div>
    </div>
  `,
  styleUrl: './confirmation-modal.scss'
})
export class ConfirmationModal {
  private dialogRef = inject(DialogRef);
  public data = inject(DIALOG_DATA) as ConfirmationData;

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
