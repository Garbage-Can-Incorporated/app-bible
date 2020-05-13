import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatDaysComponent } from './repeat-days.component';

describe('RepeatDaysComponent', () => {
  let component: RepeatDaysComponent;
  let fixture: ComponentFixture<RepeatDaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepeatDaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
