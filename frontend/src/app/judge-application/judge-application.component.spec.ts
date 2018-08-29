import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JudgeApplicationComponent } from './judge-application.component';

describe('JudgeApplicationComponent', () => {
  let component: JudgeApplicationComponent;
  let fixture: ComponentFixture<JudgeApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JudgeApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JudgeApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
