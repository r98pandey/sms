import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedProjectListComponent } from './shared-project-list.component';

describe('SharedProjectListComponent', () => {
  let component: SharedProjectListComponent;
  let fixture: ComponentFixture<SharedProjectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SharedProjectListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SharedProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
