import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmProjectWorkProgressComponent } from './pm-project-work-progress.component';

describe('PmProjectWorkProgressComponent', () => {
  let component: PmProjectWorkProgressComponent;
  let fixture: ComponentFixture<PmProjectWorkProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PmProjectWorkProgressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PmProjectWorkProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
