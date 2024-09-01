import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNewUserWithidComponent } from './view-new-user-withid.component';

describe('ViewNewUserWithidComponent', () => {
  let component: ViewNewUserWithidComponent;
  let fixture: ComponentFixture<ViewNewUserWithidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewNewUserWithidComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewNewUserWithidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
