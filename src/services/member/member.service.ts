import {Injectable} from '@angular/core';
import {FetchParams, HttpUtil, ObjectUtil, WsService} from "@worldskills/worldskills-angular-lib";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable, share} from "rxjs";
import {MemberContainer} from "../../types/member";

interface MemberFetchParams extends FetchParams {
  member_of: number;
}

@Injectable({
  providedIn: 'root'
})
export class MemberService extends WsService<any> {

  readonly url = `${environment.worldskillsApiOrg}/members`;
  private readonly WSI_ENTITY_ID: number = 1;

  constructor(private http: HttpClient) {
    super();
  }

  getMembers(fetchParams: MemberFetchParams): Observable<MemberContainer> {
    let httpParams = HttpUtil.objectToParams(ObjectUtil.stripNullOrUndefined(fetchParams || {}));
    return this.http.get<MemberContainer>(this.url, {params: httpParams}).pipe(share());
  }

  getWSIMembers(): Observable<MemberContainer> {
    return this.getMembers({member_of: this.WSI_ENTITY_ID, offset: 0, limit: 999, sort: '1058'});
  }
}
