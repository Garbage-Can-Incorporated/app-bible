import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScriptureContainerComponent } from './scripture-container.component';

describe('ScriptureContainerComponent', () => {
  let component: ScriptureContainerComponent;
  let fixture: ComponentFixture<ScriptureContainerComponent>;

  beforeEach(waitForAsync(() => {
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
