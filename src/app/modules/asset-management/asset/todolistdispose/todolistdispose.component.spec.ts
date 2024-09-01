import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodolistdisposeComponent } from './todolistdispose.component';

describe('TodolistdisposeComponent', () => {
  let component: TodolistdisposeComponent;
  let fixture: ComponentFixture<TodolistdisposeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodolistdisposeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodolistdisposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
