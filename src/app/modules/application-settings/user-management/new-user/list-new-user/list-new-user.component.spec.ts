import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNewUserComponent } from './list-new-user.component';

describe('ListNewUserComponent', () => {
  let component: ListNewUserComponent;
  let fixture: ComponentFixture<ListNewUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListNewUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListNewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
