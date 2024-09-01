import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFileUploadWithoutTypeComponent } from './project-file-upload-without-type.component';

describe('ProjectFileUploadWithoutTypeComponent', () => {
  let component: ProjectFileUploadWithoutTypeComponent;
  let fixture: ComponentFixture<ProjectFileUploadWithoutTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectFileUploadWithoutTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectFileUploadWithoutTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
