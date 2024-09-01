import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTaskSubTaskComponent } from './main-task-sub-task.component';

describe('MainTaskSubTaskComponent', () => {
  let component: MainTaskSubTaskComponent;
  let fixture: ComponentFixture<MainTaskSubTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainTaskSubTaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainTaskSubTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
