import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckedInUsersComponent } from './checked-in-users.component';

describe('CheckedInUsersComponent', () => {
  let component: CheckedInUsersComponent;
  let fixture: ComponentFixture<CheckedInUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckedInUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckedInUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
