import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../login.service';

import * as io from "socket.io-client";
declare var $;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  socket = io('http://localhost:8000/');

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit() {
    if(localStorage.getItem('loggedInUser')){
      this.router.navigate(['chatbox']);
      console.log('Logged In');
    }
  }

  login(){
    var name = $('#l_name').val();
    var password = $('#l_password').val();
    let data = {};
    data['Name'] = name;
    data['Password'] = password;
    this.loginService.login(data)
      .subscribe(response => {
        if(response['_body'] == 'success'){
          localStorage.setItem('loggedInUser', name);
          this.router.navigate(['chatbox']);
        }else if(response['_body'] == 'invalid'){
          $('#error').css('display','block');
        }
      });
  }

  register(){
    var name = $('#r_name').val();
    var password = $('#r_password').val();
    let data = {};
    data['Name'] = name;
    data['Password'] = password;
    this.loginService.register(data)
      .subscribe(response => {
        if(response == 'success'){
          localStorage.setItem('loggedInUser', JSON.stringify(name));
        }else if(response == 'error'){
          $('#error').css('display','block');
        }
      });
  }

}
