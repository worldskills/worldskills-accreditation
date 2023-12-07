import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgesDeterminerComponent } from './badges-determiner.component';

describe('BadgesDeterminerComponent', () => {
  let component: BadgesDeterminerComponent;
  let fixture: ComponentFixture<BadgesDeterminerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BadgesDeterminerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BadgesDeterminerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
