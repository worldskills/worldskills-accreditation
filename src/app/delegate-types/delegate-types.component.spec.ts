import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegateTypesComponent } from './delegate-types.component';

describe('DelegateTypesComponent', () => {
  let component: DelegateTypesComponent;
  let fixture: ComponentFixture<DelegateTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegateTypesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelegateTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
