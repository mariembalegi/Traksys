import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveOperatorCard } from './active-operator-card';

describe('ActiveOperatorCard', () => {
  let component: ActiveOperatorCard;
  let fixture: ComponentFixture<ActiveOperatorCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveOperatorCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveOperatorCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
