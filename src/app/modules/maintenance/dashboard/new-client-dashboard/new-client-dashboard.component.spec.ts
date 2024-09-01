import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewClientDashboardComponent } from './new-client-dashboard.component';

describe('NewClientDashboardComponent', () => {
  let component: NewClientDashboardComponent;
  let fixture: ComponentFixture<NewClientDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewClientDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewClientDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
