import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDocumentListActionComponent } from './project-document-list-action.component';

describe('ProjectDocumentListActionComponent', () => {
  let component: ProjectDocumentListActionComponent;
  let fixture: ComponentFixture<ProjectDocumentListActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectDocumentListActionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectDocumentListActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
