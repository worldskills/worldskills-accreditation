import {Component, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import QrScanner from "qr-scanner";
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {AppService} from "../../services/app/app.service";

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.css']
})
export class QrScannerComponent extends WsComponent implements OnInit, OnDestroy {

  @Output() scanResult: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('videoElement') videoElement: ElementRef;

  scanning = false;
  qrScanner: QrScanner;

  constructor(private ngZone: NgZone) {
    super();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.qrScanner = new QrScanner(
      this.videoElement.nativeElement,
      result => {
        // this.qrScanner.stop();
        // this.scanning = false;
        this.ngZone.run(() => {
          console.log(result.data);
          this.scanResult.emit(result.data);
        });
      },
      {
        highlightScanRegion: true,
      },
    );
    this.scanBadge();
  }

  scanBadge() {
    this.scanning = true;
    this.qrScanner.start();
  }

  cancel() {
    this.qrScanner.stop();
    this.scanning = false;
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.qrScanner.destroy();
  }
}
