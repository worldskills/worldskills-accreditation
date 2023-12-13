import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageOptionsComponent } from './package-options.component';

describe('PackageOptionsComponent', () => {
  let component: PackageOptionsComponent;
  let fixture: ComponentFixture<PackageOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageOptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
