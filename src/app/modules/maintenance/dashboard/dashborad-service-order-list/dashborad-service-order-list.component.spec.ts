import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboradServiceOrderListComponent } from './dashborad-service-order-list.component';

describe('DashboradServiceOrderListComponent', () => {
  let component: DashboradServiceOrderListComponent;
  let fixture: ComponentFixture<DashboradServiceOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboradServiceOrderListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboradServiceOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
