import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWorkProgressSubTaskDocumentUploadComponent } from './project-work-progress-sub-task-document-upload.component';

describe('ProjectWorkProgressSubTaskDocumentUploadComponent', () => {
  let component: ProjectWorkProgressSubTaskDocumentUploadComponent;
  let fixture: ComponentFixture<ProjectWorkProgressSubTaskDocumentUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectWorkProgressSubTaskDocumentUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectWorkProgressSubTaskDocumentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
