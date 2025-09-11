import {Component, inject, OnInit} from '@angular/core';
import {DialogRef, DIALOG_DATA, Dialog} from '@angular/cdk/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PiecesService } from '../../core/services/pieces.service';
import { MaterialsService } from '../../core/services/materials.service';
import { UploadService } from '../../core/services/upload.service';
import { AddMaterialModal } from '../add-material-modal/add-material-modal';

@Component({
  selector: 'app-add-edit-piece-modal',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-edit-piece-modal.html',
  styleUrl: './add-edit-piece-modal.scss'
})
export class AddEditPieceModal implements OnInit {
  private dialogRef = inject(DialogRef, {optional: true});
  private dialog = inject(Dialog);
  private formBuilder = inject(FormBuilder);
  private piecesService = inject(PiecesService);
  private materialsService = inject(MaterialsService);
  private uploadService = inject(UploadService);
  public data = inject(DIALOG_DATA, {optional: true});

  pieceForm!: FormGroup;
  materials: any[] = [];
  isLoading = false;
  isEdit = false;
  selectedDesignFile: File | null = null;
  selectedDesignPicture: File | null = null;

  ngOnInit() {
    this.isEdit = this.data?.isEdit || false;
    this.initForm();
    this.loadMaterials();

    if (this.isEdit && this.data?.piece) {
      this.populateForm(this.data.piece);
    }
  }

  initForm() {
    this.pieceForm = this.formBuilder.group({
      reference: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: [''],
      materialId: [''],
      materialQuantity: [0],
      quantity: [1, [Validators.required, Validators.min(1)]],
      status: ['To Do'],
      progress: [0]
    });
  }

  loadMaterials() {
    this.materialsService.getMaterials().subscribe({
      next: (response) => {
        this.materials = response.materials;
      },
      error: (error) => {
        console.error('Error loading materials:', error);
      }
    });
  }

  populateForm(piece: any) {
    this.pieceForm.patchValue({
      reference: piece.reference,
      name: piece.name,
      description: piece.description,
      materialId: piece.materialId,
      materialQuantity: piece.materialQuantity,
      quantity: piece.quantity,
      status: piece.status,
      progress: piece.progress
    });
  }

  onFileSelected(event: any, type: 'designFile' | 'designPicture') {
    const file = event.target.files[0];
    if (file) {
      if (type === 'designFile') {
        this.selectedDesignFile = file;
      } else {
        this.selectedDesignPicture = file;
      }
    }
  }

  async onSubmit() {
    if (this.pieceForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      try {
        let pieceData = { ...this.pieceForm.value };
        
        // Handle file uploads first
        if (this.selectedDesignFile) {
          const uploadResponse = await this.uploadService.uploadDesignFile(this.selectedDesignFile).toPromise();
          pieceData.designFile = uploadResponse?.url;
        }
        
        if (this.selectedDesignPicture) {
          const uploadResponse = await this.uploadService.uploadDesignPicture(this.selectedDesignPicture).toPromise();
          pieceData.designPicture = uploadResponse?.url;
        }

        // Add project ID for new pieces
        if (!this.isEdit) {
          pieceData.projectId = this.data?.projectId;
        }

        let result;
        if (this.isEdit) {
          result = await this.piecesService.updatePiece(this.data.piece.id, pieceData).toPromise();
        } else {
          result = await this.piecesService.createPiece(pieceData).toPromise();
        }

        this.closeModal('saved');
      } catch (error) {
        console.error('Error saving piece:', error);
        // Error toast will be shown by the global error interceptor
      } finally {
        this.isLoading = false;
      }
    }
  }

  addMaterialModal() {
    const dialogRef = this.dialog.open(AddMaterialModal, {
      width: '600px',
      disableClose: true
    });

    dialogRef.closed.subscribe((result: any) => {
      if (result && result !== 'canceled') {
        this.loadMaterials();
      }
    });
  }

  protected closeModal(result?: string) {
    this.dialogRef?.close(result);
  }
}
