import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsReplyComponent } from './topics-reply.component';

describe('TopicsReplyComponent', () => {
  let component: TopicsReplyComponent;
  let fixture: ComponentFixture<TopicsReplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicsReplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicsReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
