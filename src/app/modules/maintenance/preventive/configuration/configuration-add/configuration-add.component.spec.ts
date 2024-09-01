import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationAddComponent } from './configuration-add.component';

describe('ConfigurationAddComponent', () => {
  let component: ConfigurationAddComponent;
  let fixture: ComponentFixture<ConfigurationAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
