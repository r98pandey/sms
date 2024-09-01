import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainComponentListComponent } from './main-component-list.component';

describe('MainComponentListComponent', () => {
  let component: MainComponentListComponent;
  let fixture: ComponentFixture<MainComponentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainComponentListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainComponentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
