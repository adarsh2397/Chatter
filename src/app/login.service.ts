import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class LoginService {

  private serverUrl = 'http://localhost:8000/';

  constructor(
    private http: Http
  ) { }

  public login(data){
    let specificUrl = this.serverUrl + 'LoginUser';
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers:headers});
    let params = new URLSearchParams();

    params.set('Name', data['Name']);
    params.set('Password', data['Password']);
    console.log('Submission in process');

    return this.http.post(specificUrl, params, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public register(data){
    let specificUrl = this.serverUrl + 'RegisterUser';
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers:headers});
    let params = new URLSearchParams();

    params.set('Name', data['Name']);
    params.set('Password', data['Password']);
    console.log('Submission in process');

    return this.http.post(specificUrl, params, options)
      .map(this.extractData)
      .catch(this.handleError);
  }


  private extractData(res: Response) {
    //console.log(res);
    return res['_body'];
  }

  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
