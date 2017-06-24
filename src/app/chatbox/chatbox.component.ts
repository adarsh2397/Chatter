import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    if(!localStorage.getItem('loggedInUser')){
      this.router.navigate(['login']);
    }
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['login']);
  }

}
