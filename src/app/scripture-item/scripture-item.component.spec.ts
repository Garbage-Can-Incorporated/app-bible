import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScriptureItemComponent } from './scripture-item.component';

describe('ScriptureItemComponent', () => {
  let component: ScriptureItemComponent;
  let fixture: ComponentFixture<ScriptureItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptureItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptureItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
