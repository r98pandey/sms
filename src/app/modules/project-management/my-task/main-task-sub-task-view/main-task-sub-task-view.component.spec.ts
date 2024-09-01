import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTaskSubTaskViewComponent } from './main-task-sub-task-view.component';

describe('MainTaskSubTaskViewComponent', () => {
  let component: MainTaskSubTaskViewComponent;
  let fixture: ComponentFixture<MainTaskSubTaskViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainTaskSubTaskViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainTaskSubTaskViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
