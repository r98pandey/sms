import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaudittrackerComponent } from './listaudittracker.component';

describe('ListaudittrackerComponent', () => {
  let component: ListaudittrackerComponent;
  let fixture: ComponentFixture<ListaudittrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaudittrackerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaudittrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
