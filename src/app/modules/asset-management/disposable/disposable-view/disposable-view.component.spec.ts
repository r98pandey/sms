import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisposableViewComponent } from './disposable-view.component';

describe('DisposableViewComponent', () => {
  let component: DisposableViewComponent;
  let fixture: ComponentFixture<DisposableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisposableViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisposableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
