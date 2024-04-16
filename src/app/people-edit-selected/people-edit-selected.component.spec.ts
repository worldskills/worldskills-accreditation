import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleEditSelectedComponent } from './people-edit-selected.component';

describe('PeopleEditSelectedComponent', () => {
  let component: PeopleEditSelectedComponent;
  let fixture: ComponentFixture<PeopleEditSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeopleEditSelectedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleEditSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
