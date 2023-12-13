import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonBadgePreviewComponent } from './person-badge-preview.component';

describe('PersonBadgePreviewComponent', () => {
  let component: PersonBadgePreviewComponent;
  let fixture: ComponentFixture<PersonBadgePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonBadgePreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonBadgePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
