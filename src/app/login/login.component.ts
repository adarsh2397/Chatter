import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../login.service';

import * as io from 'socket.io-client';
declare var $;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

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
    const name = $('#l_name').val();
    const password = $('#l_password').val();
    let data = {};
    data['Name'] = name;
    data['Password'] = password;
    this.loginService.login(data)
      .subscribe(response => {
        console.log(response);
        var res = JSON.parse(response);
        if(res.result === 'success'){
          localStorage.setItem('loggedInUser', res.name);
          this.router.navigate(['chatbox']);
        }else if(res.result === 'invalid'){
          $('#error').css('display','block');
        }
      });
  }

  register(){
    const name = $('#r_name').val();
    const password = $('#r_password').val();
    const data = {};
    data['Name'] = name;
    data['Password'] = password;
    this.loginService.register(data)
      .subscribe(response => {
        if(response == 'success'){
          localStorage.setItem('loggedInUser', JSON.stringify(name));
          this.router.navigate(['chatbox']);
        }else if(response == 'error'){
          $('#error').css('display','block');
        }
      });
  }

}
