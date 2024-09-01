import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisposableListComponent } from './disposable-list.component';

describe('DisposableListComponent', () => {
  let component: DisposableListComponent;
  let fixture: ComponentFixture<DisposableListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisposableListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisposableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
