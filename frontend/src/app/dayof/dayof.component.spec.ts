import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayofComponent } from './dayof.component';

describe('DayofComponent', () => {
  let component: DayofComponent;
  let fixture: ComponentFixture<DayofComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayofComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayofComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
