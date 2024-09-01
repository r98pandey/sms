import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNewProccessComponent } from './view-new-proccess.component';

describe('ViewNewProccessComponent', () => {
  let component: ViewNewProccessComponent;
  let fixture: ComponentFixture<ViewNewProccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewNewProccessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewNewProccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
