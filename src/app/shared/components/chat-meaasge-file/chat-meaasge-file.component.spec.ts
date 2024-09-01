import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMeaasgeFileComponent } from './chat-meaasge-file.component';

describe('ChatMeaasgeFileComponent', () => {
  let component: ChatMeaasgeFileComponent;
  let fixture: ComponentFixture<ChatMeaasgeFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatMeaasgeFileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatMeaasgeFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
