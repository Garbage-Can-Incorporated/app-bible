import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptureContainerComponent } from './scripture-container.component';

describe('ScriptureContainerComponent', () => {
  let component: ScriptureContainerComponent;
  let fixture: ComponentFixture<ScriptureContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptureContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptureContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
