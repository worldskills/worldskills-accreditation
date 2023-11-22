import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeTemplatesComponent } from './badge-templates.component';

describe('BadgeTemplatesComponent', () => {
  let component: BadgeTemplatesComponent;
  let fixture: ComponentFixture<BadgeTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BadgeTemplatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BadgeTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
