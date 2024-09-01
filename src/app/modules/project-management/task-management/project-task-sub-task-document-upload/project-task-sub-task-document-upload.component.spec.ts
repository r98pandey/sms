import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTaskSubTaskDocumentUploadComponent } from './project-task-sub-task-document-upload.component';

describe('ProjectTaskSubTaskDocumentUploadComponent', () => {
  let component: ProjectTaskSubTaskDocumentUploadComponent;
  let fixture: ComponentFixture<ProjectTaskSubTaskDocumentUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectTaskSubTaskDocumentUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectTaskSubTaskDocumentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
