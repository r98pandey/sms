import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationViewComponent } from './configuration-view.component';

describe('ConfigurationViewComponent', () => {
  let component: ConfigurationViewComponent;
  let fixture: ComponentFixture<ConfigurationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
