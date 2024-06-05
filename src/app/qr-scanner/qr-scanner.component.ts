import {Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import QrScanner from "qr-scanner";
import {WsComponent} from "@worldskills/worldskills-angular-lib";

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.css']
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
    this.scanBadge();
  }

  scanBadge() {
    this.qrScanner.start();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.qrScanner.destroy();
  }
}
