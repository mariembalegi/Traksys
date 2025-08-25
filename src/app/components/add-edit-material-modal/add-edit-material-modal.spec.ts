import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMaterialModal } from './add-edit-material-modal';

describe('AddEditMaterialModal', () => {
  let component: AddEditMaterialModal;
  let fixture: ComponentFixture<AddEditMaterialModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditMaterialModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditMaterialModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
