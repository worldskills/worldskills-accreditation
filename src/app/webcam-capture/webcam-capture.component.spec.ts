import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebcamCaptureComponent } from './webcam-capture.component';

describe('WebcamCaptureComponent', () => {
  let component: WebcamCaptureComponent;
  let fixture: ComponentFixture<WebcamCaptureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebcamCaptureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebcamCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
