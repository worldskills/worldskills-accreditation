import {Component, OnInit} from '@angular/core';
import {NgAuthService, UploadService, UserRoleUtil, WsComponent} from "@worldskills/worldskills-angular-lib";
import {ActivatedRoute, Router} from "@angular/router";
import {PersonAccreditationService} from "../../services/person-accreditation/person-accreditation.service";
import {Event} from "../../types/event";
import {AppService} from "../../services/app/app.service";
import {combineLatest, debounceTime, distinctUntilChanged, Subject} from "rxjs";
import {PersonAccreditation} from "../../types/person-accreditation";
import {environment} from "../../environments/environment";
import {DelegateType} from "../../types/delegate-type";
import {DelegateTypeService} from "../../services/delegate-type/delegate-type.service";
import {ZoneService} from "../../services/zone/zone.service";
import {Zone} from "../../types/zone";
import {Location} from "@angular/common";
import {ToastService} from "angular-toastify";
import {ImageService} from "../../services/image/image.service";
import {Image} from "../../types/image";
import {HttpEventType} from "@angular/common/http";

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent extends WsComponent implements OnInit {

  readonly peopleURL = environment.worldskillsPeople;
  selectedEvent: Event;
  delegateTypes: DelegateType[];
  zones: Zone[] = [];

  // upload ACR photo variables
  overrideACRPhoto: File;
  openModalMode: 'CLOSED' | 'CAMERA' | 'UPLOAD' = 'CLOSED';
  isUploadingPhoto = false;
  uploadingPhotoProgress: number = 0;

  // override person acr
  personAcr: PersonAccreditation;
  savingPersonAcr = false;
  badgeLinesChange: Subject<string> = new Subject<string>();

  // permissions
  hasEditPermission = false;
  hasPrintPermission = false;
  hasAdminPermission = false;
  hasUploadPhotoPermission = true;

  constructor(private appService: AppService,
              private router: Router,
              private route: ActivatedRoute,
              private personAccreditationService: PersonAccreditationService,
              private delegateTypeService: DelegateTypeService,
              private zoneService: ZoneService,
              private location: Location,
              private authService: NgAuthService,
              private toastService: ToastService,
              private imageService: ImageService,
              private uploadService: UploadService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.appService.showMenuTabs.next(false);

    // load current user and check permissions
    this.subscribe(
      this.authService.currentUser.subscribe(currentUser => {
        this.hasEditPermission = UserRoleUtil.userHasRoles(currentUser, environment.worldskillsAppId, environment.appRoles.ADMIN, environment.appRoles.EDIT);
        this.hasPrintPermission = UserRoleUtil.userHasRoles(currentUser, environment.worldskillsAppId, environment.appRoles.ADMIN, environment.appRoles.PRINT);
        this.hasAdminPermission = UserRoleUtil.userHasRoles(currentUser, environment.worldskillsAppId, environment.appRoles.ADMIN);
        this.hasUploadPhotoPermission = UserRoleUtil.userHasRoles(currentUser, environment.worldskillsAppId, environment.appRoles.ADMIN, environment.appRoles.UPLOAD_PHOTO);
      })
    )

    // load selectedEvent and data depending on it
    combineLatest([this.appService.selectedEvent, this.route.params])
      .subscribe(([event, {personAcrId}]) => {
        this.selectedEvent = event;
        this.subscribe(
          this.loadPersonAccreditation(personAcrId),
          this.delegateTypeService.getList(this.selectedEvent.id).subscribe(res => {
            this.delegateTypes = res.delegate_types;
          }),
          this.zoneService.getList(this.selectedEvent.id).subscribe(res => {
            this.zones = res.zones;
          })
        );
      });

    // saving badge lines only when user stops typing for 400ms and when the lines have changed
    this.badgeLinesChange.pipe(debounceTime(400), distinctUntilChanged()).subscribe(lines => {
      this.personAcr.lines = lines;
      this.updatePersonAccreditation();
    });
  }

  private loadPersonAccreditation(personAcrId: number) {
    return this.personAccreditationService.getPersonAccreditation(this.selectedEvent.id, personAcrId).subscribe(person => {
      this.personAcr = person;
    });
  }

  updatePersonAccreditation(): void {
    this.savingPersonAcr = true;
    this.subscribe(
      this.personAccreditationService.updatePersonAccreditation(this.selectedEvent.id, this.personAcr.id, this.personAcr).subscribe(res => {
        this.personAcr = res;
        this.savingPersonAcr = false;
      })
    );
  }

  onDelTypeChange(dt: DelegateType) {
    this.personAcr.delegate_type = dt;
    this.updatePersonAccreditation();
  }

  onBadgeLinesChange(lines: string) {
    this.badgeLinesChange.next(lines);
  }

  private hasZone(zone: Zone): boolean {
    return this.personAcr.summary.zones.map(z => z.id).includes(zone.id);
  }

  getZonesToAdd(): Zone[] {
    return this.zones.filter(zone => !this.hasZone(zone));
  }

  getZonesToRemove(): Zone[] {
    return this.zones.filter(zone => this.hasZone(zone));
  }

  addZone(zone: Zone) {
    if (this.personAcr.zones_add == null) {
      this.personAcr.zones_add = [];
    }
    if (this.personAcr.zones_add.filter(z => z.id === zone.id).length > 0) {
      this.personAcr.zones_add = this.personAcr.zones_add.filter(z => z.id !== zone.id);
    } else {
      this.personAcr.zones_add.push(zone);
    }

    this.updatePersonAccreditation();
  }

  removeZone(zone: Zone) {
    if (this.personAcr.zones_remove == null) {
      this.personAcr.zones_remove = [];
    }

    if (this.personAcr.zones_remove.filter(z => z.id === zone.id).length > 0) {
      this.personAcr.zones_remove = this.personAcr.zones_remove.filter(z => z.id !== zone.id);
    } else {
      this.personAcr.zones_remove.push(zone);
    }

    this.updatePersonAccreditation();
  }

  printPreview(): void {
    const urlTree = this.router.createUrlTree(['../../print/' + this.personAcr.id], {relativeTo: this.route});
    const url = this.router.serializeUrl(urlTree);
    window.open(url, '_blank');
  }

  backToPeopleList(): void {
    this.location.back();
  }

  invalidateBadge(): void {
    if (confirm('This will generate a new random code for the QR code. Any existing badge will no longer be valid. Proceed?')) {
      this.personAccreditationService.invalidateBadge(this.selectedEvent.id, this.personAcr.id).subscribe(_ => {
        this.toastService.success('New random code for QR code generated.');

        // reload person accreditation
        this.subscribe(this.loadPersonAccreditation(this.personAcr.id));
      });
    }
  }

  markAsDistributed(): void {
    this.personAccreditationService.markAsDistributed(this.selectedEvent.id, this.personAcr.id).subscribe(_ => {
      this.toastService.success('Person accreditation marked as distributed');

      // reload person accreditation
      this.subscribe(this.loadPersonAccreditation(this.personAcr.id));
    });
  }

  setFileFromInput(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files.length > 0) {
      this.overrideACRPhoto = input.files.item(0);
    } else {
      this.overrideACRPhoto = null;
    }
  }


  uploadACRPhoto(): void {
    this.isUploadingPhoto = true;
    this.uploadingPhotoProgress = 0;

    const request = this.imageService.httpRequest(this.overrideACRPhoto);
    this.uploadService.listen<Image>(
      request,
      ({loaded, total, type}) => {
        if (type === HttpEventType.UploadProgress) {
          this.uploadingPhotoProgress = loaded / total;
        }
      },
      image => {
        this.personAccreditationService.uploadAccreditationPhoto(this.selectedEvent.id, this.personAcr.id, {
          id: image.body.id,
          thumbnail_hash: image.body.thumbnail_hash
        }).subscribe(() => {
          this.isUploadingPhoto = false;
          this.toastService.success('Photo uploaded!');
          this.overrideACRPhoto = null;
          this.openModalMode = 'CLOSED';

          // use timeout to wait for RabbitMQ message arrives back
          setTimeout(() => {
            // reload person accreditation
            this.subscribe(this.loadPersonAccreditation(this.personAcr.id));
          }, 100);
        });
      });
  }

  captureImage(imageDataURL: File) {
    this.overrideACRPhoto = imageDataURL;
  }
}
