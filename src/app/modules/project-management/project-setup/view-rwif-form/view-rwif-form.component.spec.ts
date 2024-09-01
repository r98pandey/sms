import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRwifFormComponent } from './view-rwif-form.component';

describe('ViewRwifFormComponent', () => {
  let component: ViewRwifFormComponent;
  let fixture: ComponentFixture<ViewRwifFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewRwifFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewRwifFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
