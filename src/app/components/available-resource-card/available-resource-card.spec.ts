import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableResourceCard } from './available-resource-card';

describe('AvailableResourceCard', () => {
  let component: AvailableResourceCard;
  let fixture: ComponentFixture<AvailableResourceCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableResourceCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableResourceCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
