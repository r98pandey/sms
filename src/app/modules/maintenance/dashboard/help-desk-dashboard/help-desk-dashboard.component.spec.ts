import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDeskDashboardComponent } from './help-desk-dashboard.component';

describe('HelpDeskDashboardComponent', () => {
  let component: HelpDeskDashboardComponent;
  let fixture: ComponentFixture<HelpDeskDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpDeskDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpDeskDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
