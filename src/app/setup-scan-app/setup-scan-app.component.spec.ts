import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupScanAppComponent } from './setup-scan-app.component';

describe('SetupScanAppComponent', () => {
  let component: SetupScanAppComponent;
  let fixture: ComponentFixture<SetupScanAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetupScanAppComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetupScanAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
