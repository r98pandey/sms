import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartMainTaskSubTaskListComponent } from './start-main-task-sub-task-list.component';

describe('StartMainTaskSubTaskListComponent', () => {
  let component: StartMainTaskSubTaskListComponent;
  let fixture: ComponentFixture<StartMainTaskSubTaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StartMainTaskSubTaskListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StartMainTaskSubTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
