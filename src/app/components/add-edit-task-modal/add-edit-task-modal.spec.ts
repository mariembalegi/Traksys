import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTaskModal } from './add-edit-task-modal';

describe('AddEditTaskModal', () => {
  let component: AddEditTaskModal;
  let fixture: ComponentFixture<AddEditTaskModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditTaskModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditTaskModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
