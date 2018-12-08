import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSubscribeComponent } from './event-subscribe.component';

describe('EventSubscribeComponent', () => {
  let component: EventSubscribeComponent;
  let fixture: ComponentFixture<EventSubscribeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventSubscribeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventSubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
