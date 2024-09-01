import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTaskSubTaskListComponent } from './main-task-sub-task-list.component';

describe('MainTaskSubTaskListComponent', () => {
  let component: MainTaskSubTaskListComponent;
  let fixture: ComponentFixture<MainTaskSubTaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainTaskSubTaskListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainTaskSubTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
