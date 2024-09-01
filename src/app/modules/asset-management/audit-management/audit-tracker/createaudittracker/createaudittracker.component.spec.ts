import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateaudittrackerComponent } from './createaudittracker.component';

describe('CreateaudittrackerComponent', () => {
  let component: CreateaudittrackerComponent;
  let fixture: ComponentFixture<CreateaudittrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateaudittrackerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateaudittrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
