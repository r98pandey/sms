import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewassetprofileComponent } from './viewassetprofile.component';

describe('ViewassetprofileComponent', () => {
  let component: ViewassetprofileComponent;
  let fixture: ComponentFixture<ViewassetprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewassetprofileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewassetprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
