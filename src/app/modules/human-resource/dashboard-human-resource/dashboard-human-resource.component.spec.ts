import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardHumanResourceComponent } from './dashboard-human-resource.component';

describe('DashboardHumanResourceComponent', () => {
  let component: DashboardHumanResourceComponent;
  let fixture: ComponentFixture<DashboardHumanResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardHumanResourceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardHumanResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
