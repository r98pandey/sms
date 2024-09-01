import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareDashboardComponent } from './software-dashboard.component';

describe('SoftwareDashboardComponent', () => {
  let component: SoftwareDashboardComponent;
  let fixture: ComponentFixture<SoftwareDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoftwareDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoftwareDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
