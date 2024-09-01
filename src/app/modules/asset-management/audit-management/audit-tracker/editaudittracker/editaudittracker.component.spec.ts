import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditaudittrackerComponent } from './editaudittracker.component';

describe('EditaudittrackerComponent', () => {
  let component: EditaudittrackerComponent;
  let fixture: ComponentFixture<EditaudittrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditaudittrackerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditaudittrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
