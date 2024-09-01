import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewauditComponent } from './viewaudit.component';

describe('ViewauditComponent', () => {
  let component: ViewauditComponent;
  let fixture: ComponentFixture<ViewauditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewauditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewauditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
