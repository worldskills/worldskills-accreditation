import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegateTypesFormComponent } from './delegate-types-form.component';

describe('DelegateTypesFormComponent', () => {
  let component: DelegateTypesFormComponent;
  let fixture: ComponentFixture<DelegateTypesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegateTypesFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelegateTypesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
