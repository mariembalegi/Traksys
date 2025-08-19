import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusHeader } from './status-header';

describe('StatusHeader', () => {
  let component: StatusHeader;
  let fixture: ComponentFixture<StatusHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
