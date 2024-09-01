import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardEvaluationComponent } from './award-evaluation.component';

describe('AwardEvaluationComponent', () => {
  let component: AwardEvaluationComponent;
  let fixture: ComponentFixture<AwardEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AwardEvaluationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AwardEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
