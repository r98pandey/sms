import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFileManagerComponent } from './new-file-manager.component';

describe('NewFileManagerComponent', () => {
  let component: NewFileManagerComponent;
  let fixture: ComponentFixture<NewFileManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewFileManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewFileManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
