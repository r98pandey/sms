import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditauditComponent } from './editaudit.component';

describe('EditauditComponent', () => {
  let component: EditauditComponent;
  let fixture: ComponentFixture<EditauditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditauditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditauditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
