import {Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import QrScanner from "qr-scanner";
import {WsComponent} from "@worldskills/worldskills-angular-lib";

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.css'],
  standalone: false
})
export class QrScannerComponent extends WsComponent implements OnInit, OnDestroy {

  @Input() highlightScanRegion = true;
  @Input() maxScansPerSecond = 25;
  @Input() nSecondsDelayAfterSameScanOutput = 2500;
  @Output() scanResult: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('videoElement') videoElement: ElementRef;

  lastEmittedScanOutput: string = '';
  scanDuration: number = 0;
  scanning: boolean = false;

  qrScanner: QrScanner;
  cameras: QrScanner.Camera[];
  cameraIndex: number = 0;

  isSleeping: boolean = false;

  constructor(private ngZone: NgZone) {
    super();
  }

  ngOnInit(): void {
    // check scan duration so that we can emit the same scan output only after n seconds
    setInterval(() => {
      if (this.scanning) {
        this.scanDuration += 500;
        console.log('scanDuration', this.scanDuration);
      }
    }, 500);
  }

  ngAfterViewInit(): void {
    this.qrScanner = new QrScanner(
      this.videoElement.nativeElement,
      result => {
        // this.qrScanner.stop();
        this.scanning = false;
        this.ngZone.run(() => {
          this.scanning = true;
          // get the data from the qr code
          const data = result.data;

          // check if the same scan output is emitted within n seconds
          if (this.lastEmittedScanOutput === data && this.scanDuration < this.nSecondsDelayAfterSameScanOutput) {
            return;
          }

          // get the PersonACRID from the data
          if (data.split('-').length > 0) {
            this.scanResult.emit(parseInt(data.split('-')[0]));
            this.lastEmittedScanOutput = data;
            this.scanDuration = 0;
          }
        });
      },
      {
        highlightScanRegion: this.highlightScanRegion,
        maxScansPerSecond: this.maxScansPerSecond,
      },
    );
    QrScanner.listCameras(true).then((cameras) => {
      this.cameras = cameras;
    });
    this.scanBadge();
  }

  scanBadge() {
    this.qrScanner.start();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.qrScanner.destroy();
  }

  switchCam(): void {
    this.cameraIndex++;
    if (this.cameraIndex >= this.cameras.length) {
      this.cameraIndex = 0;
    }

    this.qrScanner.setCamera(this.cameras[this.cameraIndex].id);
  }

  switchFlash(): void {
    this.qrScanner.toggleFlash();
  }

  switchSleep(): void {
    if (this.isSleeping) {
      this.qrScanner.start();
      this.isSleeping = false;
    } else {
      this.qrScanner.stop();
      this.isSleeping = true;
    }
  }
}
