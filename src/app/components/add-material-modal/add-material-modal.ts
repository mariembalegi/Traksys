import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogRef } from '@angular/cdk/dialog';
import { MaterialsService } from '../../core/services/materials.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-add-material-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-material-modal.html',
  styleUrls: ['./add-material-modal.scss']
})
export class AddMaterialModal implements OnInit {
  private dialogRef = inject(DialogRef, { optional: true });
  private formBuilder = inject(FormBuilder);
  private materialsService = inject(MaterialsService);
  private toastService = inject(ToastService);

  materialForm!: FormGroup;
  isLoading = false;

  shapes = [
    { value: 'Cylindrical Bar', label: 'Cylindrical Bar' },
    { value: 'Plate', label: 'Plate' }
  ];

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.materialForm = this.formBuilder.group({
      material: ['', [Validators.required]],
      type: ['', [Validators.required]],
      shape: ['', [Validators.required]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      
      // Cylindrical Bar specific fields
      diameter: [null],
      length: [null],
      available_length: [null],
      min_length: [null],
      
      // Plate specific fields
      x: [null],
      y: [null],
      thickness: [null],
      available_area: [null],
      min_area: [null]
    });

    // Watch shape changes to show/hide relevant fields
    this.materialForm.get('shape')?.valueChanges.subscribe(shape => {
      this.updateValidatorsForShape(shape);
    });
  }

  updateValidatorsForShape(shape: string) {
    // Clear all validators first
    const fieldsToUpdate = ['diameter', 'length', 'available_length', 'min_length', 'x', 'y', 'thickness', 'available_area', 'min_area'];
    
    fieldsToUpdate.forEach(field => {
      this.materialForm.get(field)?.clearValidators();
      this.materialForm.get(field)?.setValue(null);
    });

    // Add validators based on shape
    if (shape === 'Cylindrical Bar') {
      this.materialForm.get('diameter')?.setValidators([Validators.required, Validators.min(0.1)]);
      this.materialForm.get('length')?.setValidators([Validators.required, Validators.min(0.1)]);
      this.materialForm.get('available_length')?.setValidators([Validators.min(0)]);
      this.materialForm.get('min_length')?.setValidators([Validators.min(0)]);
    } else if (shape === 'Plate') {
      this.materialForm.get('x')?.setValidators([Validators.required, Validators.min(0.1)]);
      this.materialForm.get('y')?.setValidators([Validators.required, Validators.min(0.1)]);
      this.materialForm.get('thickness')?.setValidators([Validators.required, Validators.min(0.1)]);
      this.materialForm.get('available_area')?.setValidators([Validators.min(0)]);
      this.materialForm.get('min_area')?.setValidators([Validators.min(0)]);
    }

    // Update validation status
    fieldsToUpdate.forEach(field => {
      this.materialForm.get(field)?.updateValueAndValidity();
    });
  }

  get selectedShape(): string {
    return this.materialForm.get('shape')?.value || '';
  }

  async onSubmit() {
    if (this.materialForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      try {
        const materialData = { ...this.materialForm.value };
        
        // Remove null values for fields not relevant to the selected shape
        Object.keys(materialData).forEach(key => {
          if (materialData[key] === null || materialData[key] === '') {
            delete materialData[key];
          }
        });

        const result = await this.materialsService.createMaterial(materialData).toPromise();
        this.toastService.showSuccess('Material added successfully');
        this.closeModal(result);
      } catch (error) {
        console.error('Error saving material:', error);
        // Error toast will be shown by the global error interceptor
      } finally {
        this.isLoading = false;
      }
    }
  }

  closeModal(result?: any) {
    this.dialogRef?.close(result);
  }
}
