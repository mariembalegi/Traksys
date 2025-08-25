import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceResourceCard } from './maintenance-resource-card';

describe('MaintenanceResourceCard', () => {
  let component: MaintenanceResourceCard;
  let fixture: ComponentFixture<MaintenanceResourceCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceResourceCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenanceResourceCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
