import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfwiformUploaderComponent } from './rfwiform-uploader.component';

describe('RfwiformUploaderComponent', () => {
  let component: RfwiformUploaderComponent;
  let fixture: ComponentFixture<RfwiformUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RfwiformUploaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RfwiformUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
