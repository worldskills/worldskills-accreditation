import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {WebcamImage, WebcamInitError, WebcamUtil} from "ngx-webcam";
import {Observable, Subject} from "rxjs";
import * as moment from "moment/moment";

@Component({
  selector: 'app-webcam-capture',
  templateUrl: './webcam-capture.component.html',
  styleUrls: ['./webcam-capture.component.css'],
  standalone: false
})
export class WebcamCaptureComponent extends WsComponent implements OnInit {

  @Output() captureImage: EventEmitter<File> = new EventEmitter<File>();
  readonly PHOTO_WIDTH = 600;
  readonly PHOTO_HEIGHT = 800;

  cameraInitErrorMsg: string = null;
  multipleWebcamsAvailable = false;
  nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  trigger: Subject<void> = new Subject<void>();
  videoOptions: MediaTrackConstraints = {
    width: {ideal: this.PHOTO_WIDTH},
    height: {ideal: this.PHOTO_HEIGHT}
  };
  webcamImage: WebcamImage = null;

  constructor() {
    super();
  }

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }


  triggerSnapshot(): void {
    this.trigger.next();
  }

  handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.captureImage.emit(this.convertToImageFile(this.webcamImage));
  }

  get webcamTriggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  showNextWebcam(directionOrDeviceId: boolean | string): void {
    this.nextWebcam.next(directionOrDeviceId);
  }

  handleCameraInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      this.cameraInitErrorMsg = "Camera access was not allowed by user. Refresh page and try again.";
    } else {
      this.cameraInitErrorMsg = null;
    }
  }

  convertToImageFile(wi: WebcamImage): File {
    const arr = wi.imageAsDataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], "webcam_" + moment().format("yyyyMMDDHHmmss"), {type: mime});
  }
}
