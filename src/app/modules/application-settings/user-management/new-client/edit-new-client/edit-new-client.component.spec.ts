import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNewClientComponent } from './edit-new-client.component';

describe('EditNewClientComponent', () => {
  let component: EditNewClientComponent;
  let fixture: ComponentFixture<EditNewClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditNewClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditNewClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
