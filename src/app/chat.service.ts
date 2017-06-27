import { Injectable, EventEmitter } from '@angular/core';

import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ChatService {

  socket: any;
  activeChats: Array<String> = [];

  chatUpdated: EventEmitter<String> = new EventEmitter();

  constructor(
    private http: Http
  ) { }

  connect(user){
    this.socket = io.connect('http://localhost:8000/', {query: 'name=' + user});
  }

  getActiveMembers(){
    const headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
    const options = new RequestOptions({headers: headers});

    return this.http.get('http://localhost:8000/GetActiveMembers')
      .map(this.extractData)
      .catch(this.handleError);
  }

  addActiveChat(name: String){
    if (!this.activeChats.find(value => value === name)){
      this.activeChats[0] = name;
      this.chatUpdated.emit(name);
    }
  }

  getMessages(from_name, to_name){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
    let options = new RequestOptions({headers:headers});
    let params = new URLSearchParams();

    params.set('from', from_name);
    params.set('to', to_name);

    return this.http.post('http://localhost:8000/GetMessages', params, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getUnseen(name){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
    let options = new RequestOptions({headers:headers});
    let params = new URLSearchParams();

    params.set('name', name);

    return this.http.post('http://localhost:8000/GetUnseen', params, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  extractData(response: Response){
    //console.log(response);
    return response['_body'];
  }

  handleError(error: Response | any){
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
