import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryNoteAddComponent } from './delivery-note-add.component';

describe('DeliveryNoteAddComponent', () => {
  let component: DeliveryNoteAddComponent;
  let fixture: ComponentFixture<DeliveryNoteAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryNoteAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryNoteAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
