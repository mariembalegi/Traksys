import {Component, inject, OnInit} from '@angular/core';
import {DialogRef} from '@angular/cdk/dialog';
import { CustomersService, Customer } from '../../core/services/customers.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-customer-modal',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-customer-modal.html',
  styleUrl: './add-customer-modal.scss'
})
export class AddCustomerModal implements OnInit {
  private dialogRef = inject(DialogRef, { optional: true });
  private customersService = inject(CustomersService);

  // Form data
  customerData: Partial<Customer> = {
    name: '',
    email: '',
    phone: '',
    address: ''
  };

  isSaving = false;
  errorMessage = '';

  ngOnInit() {
    // Initialize form
  }

  onSubmit() {
    if (!this.customerData.name?.trim()) {
      this.errorMessage = 'Customer name is required';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    this.customersService.createCustomer(this.customerData as Omit<Customer, 'id' | 'projectIds' | 'createdAt' | 'updatedAt'>).subscribe({
      next: (createdCustomer) => {
        this.isSaving = false;
        console.log('Customer created successfully:', createdCustomer);
        this.dialogRef?.close(createdCustomer);
      },
      error: (error) => {
        console.error('Error creating customer:', error);
        this.errorMessage = error.error?.message || 'Failed to create customer';
        this.isSaving = false;
      }
    });
  }

  protected closeModal() {
    this.dialogRef?.close();
  }
}
