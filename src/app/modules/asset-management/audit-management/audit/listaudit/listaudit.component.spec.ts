import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListauditComponent } from './listaudit.component';

describe('ListauditComponent', () => {
  let component: ListauditComponent;
  let fixture: ComponentFixture<ListauditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListauditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListauditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
