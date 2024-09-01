import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBotMyTaskComponent } from './chat-bot-my-task.component';

describe('ChatBotMyTaskComponent', () => {
  let component: ChatBotMyTaskComponent;
  let fixture: ComponentFixture<ChatBotMyTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatBotMyTaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatBotMyTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
