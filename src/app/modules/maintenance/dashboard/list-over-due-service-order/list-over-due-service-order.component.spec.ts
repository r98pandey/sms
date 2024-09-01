import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOverDueServiceOrderComponent } from './list-over-due-service-order.component';

describe('ListOverDueServiceOrderComponent', () => {
  let component: ListOverDueServiceOrderComponent;
  let fixture: ComponentFixture<ListOverDueServiceOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOverDueServiceOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOverDueServiceOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
