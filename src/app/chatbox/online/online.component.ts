import { Component, OnInit, Input } from '@angular/core';

import { ChatService } from '../../chat.service';

declare var $;

@Component({
  selector: 'app-online',
  templateUrl: './online.component.html',
  styleUrls: ['./online.component.css']
})
export class OnlineComponent implements OnInit {

  socket: any;
  activeMembers: any;
  unseen = [];

  constructor(
    private cs: ChatService
  ) { }

  ngOnInit() {
    this.cs.socket.on('user-change', function(data){
      this.cs.getActiveMembers().subscribe(response => {
        this.updateActiveMembers(response);
      });
    }.bind(this));
  }



  updateActiveMembers(response) {
    var res = JSON.parse(response);
    console.log(res);
    this.activeMembers = res;
  }

  setMember(name){
    this.cs.addActiveChat(name.toString());
  }

}
