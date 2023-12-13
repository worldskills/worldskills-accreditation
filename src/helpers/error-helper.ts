import {HttpErrorResponse} from '@angular/common/http';
import {GenericUtil} from '@worldskills/worldskills-angular-lib';
import {APIError} from "../types/api-error";

export const defaultErrorMessage = 'An error has occured and your action was not processed.';
export const notLoggedInCode = '2100-101';
export const authorizationMissingCode = '100-100';

// TODO: should this be in lib?
export class ErrorHelper {

  /*
  * Returns if an error is an instance of a WSI API error
  *
  * @param error - The error object extracted from an Http message
  * @returns true if this is an instance of a WSI API error
  */
  static hasApiError(error: any): boolean {
    if (GenericUtil.isNullOrUndefined(error)) {
      return false;
    }

    return error.error && error.error.user_msg;
  }

  /*
  * Returns the user message from an instance of a WSI API Error
  *
  * @param error - The error object extracted from an Http message
  * @returns The error message or a default error
  */
  static getUserMsg(error: any) {
    return this.hasApiError(error) ? defaultErrorMessage : error.error.user_msg;
  }

  /*
  * Determine if the current user is actually logged out from an http error
  *
  * @param err - The Http Error Response
  * @returns true if the user is not logged in. false if the user is logged in
  */
  static isNotLoggedIn(err: HttpErrorResponse) {
    if (err.error) {
      const apiError = new APIError(err.error);
      if (apiError.code === notLoggedInCode) {
        return true;
      }
    }

    return false;
  }

  /*
  * Determine if the current user token is stale
  *
  * @param err - The Http Error Response
  * @returns true if the user token is stale. false if the user token is valid
  */
  static hasStaleToken(err: HttpErrorResponse) {
    if (err.error) {
      const apiError = new APIError(err.error);
      if (apiError.code === authorizationMissingCode) {
        return true;
      }
    }
    if (err.error) {
      return JSON.stringify(err.error).match('Authorization token is invalid');
    }

    return false;
  }
}
