import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectKickOffComponent } from './project-kick-off.component';

describe('ProjectKickOffComponent', () => {
  let component: ProjectKickOffComponent;
  let fixture: ComponentFixture<ProjectKickOffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectKickOffComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectKickOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
