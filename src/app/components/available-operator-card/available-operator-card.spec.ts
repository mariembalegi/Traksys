import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableOperatorCard } from './available-operator-card';

describe('AvailableOperatorCard', () => {
  let component: AvailableOperatorCard;
  let fixture: ComponentFixture<AvailableOperatorCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableOperatorCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableOperatorCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
