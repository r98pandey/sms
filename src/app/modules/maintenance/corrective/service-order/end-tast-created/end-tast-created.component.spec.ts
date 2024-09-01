import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndTastCreatedComponent } from './end-tast-created.component';

describe('EndTastCreatedComponent', () => {
  let component: EndTastCreatedComponent;
  let fixture: ComponentFixture<EndTastCreatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndTastCreatedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndTastCreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
