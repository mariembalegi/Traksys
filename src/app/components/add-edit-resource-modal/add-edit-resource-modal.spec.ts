import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditResourceModal } from './add-edit-resource-modal';

describe('AddEditResourceModal', () => {
  let component: AddEditResourceModal;
  let fixture: ComponentFixture<AddEditResourceModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditResourceModal]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditResourceModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
