import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageOptionsFormComponent } from './package-options-form.component';

describe('PackageOptionsFormComponent', () => {
  let component: PackageOptionsFormComponent;
  let fixture: ComponentFixture<PackageOptionsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageOptionsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageOptionsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
