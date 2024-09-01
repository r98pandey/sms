import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewdisposeassetprofileComponent } from './viewdisposeassetprofile.component';

describe('ViewdisposeassetprofileComponent', () => {
  let component: ViewdisposeassetprofileComponent;
  let fixture: ComponentFixture<ViewdisposeassetprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewdisposeassetprofileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewdisposeassetprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
