import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScripturePlayerComponent } from './scripture-player.component';

describe('ScripturePlayerComponent', () => {
  let component: ScripturePlayerComponent;
  let fixture: ComponentFixture<ScripturePlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScripturePlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScripturePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
