import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisposableAddComponent } from './disposable-add.component';

describe('DisposableAddComponent', () => {
  let component: DisposableAddComponent;
  let fixture: ComponentFixture<DisposableAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisposableAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisposableAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
