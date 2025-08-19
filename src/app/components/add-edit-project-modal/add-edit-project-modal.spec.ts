import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProjectModal } from './add-edit-project-modal';

describe('AddEditProjectModal', () => {
  let component: AddEditProjectModal;
  let fixture: ComponentFixture<AddEditProjectModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditProjectModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditProjectModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
