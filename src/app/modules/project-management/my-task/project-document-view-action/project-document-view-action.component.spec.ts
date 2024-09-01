import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDocumentViewActionComponent } from './project-document-view-action.component';

describe('ProjectDocumentViewActionComponent', () => {
  let component: ProjectDocumentViewActionComponent;
  let fixture: ComponentFixture<ProjectDocumentViewActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectDocumentViewActionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectDocumentViewActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
