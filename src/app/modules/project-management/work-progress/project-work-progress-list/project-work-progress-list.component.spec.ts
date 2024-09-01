import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWorkProgressListComponent } from './project-work-progress-list.component';

describe('ProjectWorkProgressListComponent', () => {
  let component: ProjectWorkProgressListComponent;
  let fixture: ComponentFixture<ProjectWorkProgressListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectWorkProgressListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectWorkProgressListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
