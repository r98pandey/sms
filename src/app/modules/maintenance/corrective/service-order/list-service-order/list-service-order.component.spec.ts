import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListServiceOrderComponent } from './list-service-order.component';

describe('ListServiceOrderComponent', () => {
  let component: ListServiceOrderComponent;
  let fixture: ComponentFixture<ListServiceOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListServiceOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListServiceOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
