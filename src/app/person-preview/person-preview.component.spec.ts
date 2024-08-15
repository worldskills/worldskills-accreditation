import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonPreviewComponent } from './person-preview.component';

describe('PersonPreviewComponent', () => {
  let component: PersonPreviewComponent;
  let fixture: ComponentFixture<PersonPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
