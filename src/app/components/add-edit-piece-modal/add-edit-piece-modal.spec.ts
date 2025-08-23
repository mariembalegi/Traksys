import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPieceModal } from './add-edit-piece-modal';

describe('AddEditPieceModal', () => {
  let component: AddEditPieceModal;
  let fixture: ComponentFixture<AddEditPieceModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditPieceModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditPieceModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
