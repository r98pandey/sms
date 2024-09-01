import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryNoteViewComponent } from './delivery-note-view.component';

describe('DeliveryNoteViewComponent', () => {
  let component: DeliveryNoteViewComponent;
  let fixture: ComponentFixture<DeliveryNoteViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryNoteViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryNoteViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
