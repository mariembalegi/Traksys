import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveResourceCard } from './active-resource-card';

describe('ActiveResourceCard', () => {
  let component: ActiveResourceCard;
  let fixture: ComponentFixture<ActiveResourceCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveResourceCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveResourceCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
