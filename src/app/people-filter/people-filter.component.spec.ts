import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleFilterComponent } from './people-filter.component';

describe('PeopleFilterComponent', () => {
  let component: PeopleFilterComponent;
  let fixture: ComponentFixture<PeopleFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeopleFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
