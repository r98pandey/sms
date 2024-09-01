import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAddProjectComponent } from './new-add-project.component';

describe('NewAddProjectComponent', () => {
  let component: NewAddProjectComponent;
  let fixture: ComponentFixture<NewAddProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewAddProjectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewAddProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
