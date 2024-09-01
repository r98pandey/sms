import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockPageComponent } from './lock-page.component';

describe('LockPageComponent', () => {
  let component: LockPageComponent;
  let fixture: ComponentFixture<LockPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LockPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LockPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
