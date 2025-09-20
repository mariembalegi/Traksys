import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnavailableOperatorCard } from './unavailable-operator-card';

describe('UnavailableOperatorCard', () => {
  let component: UnavailableOperatorCard;
  let fixture: ComponentFixture<UnavailableOperatorCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnavailableOperatorCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnavailableOperatorCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
