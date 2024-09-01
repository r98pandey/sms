import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAccessRightComponent } from './list-access-right.component';

describe('ListAccessRightComponent', () => {
  let component: ListAccessRightComponent;
  let fixture: ComponentFixture<ListAccessRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListAccessRightComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListAccessRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
