import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ChatService } from '../chat.service';

import { Message } from '../message';
declare var $;

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {

  socket: any;
  user: String;
  typing = false;
  messages: Array<Message> = [];
  chats: Array<String> = [];
  date: Date;


  constructor(
    private router: Router,
    private cs: ChatService
  ) { 
    this.date = new Date();
  }

  ngOnInit() {
    this.user = localStorage.getItem('loggedInUser');

    this.cs.connect(this.user);

    if(!localStorage.getItem('loggedInUser')){
      this.router.navigate(['login']);
    }else{

      this.cs.socket.on('disconnect', function(data){
        localStorage.clear();
        window.location.reload();
      });

      this.cs.socket.on('message-receive', function(message){
        console.log('receive');
        let mes = new Message;
        mes.createMessage(message['from'], message['to'], message['body'], message['time'],true);
        this.messages.push(mes);

        setTimeout(this.updateScroll, 100);
      }.bind(this));
    }

    this.cs.chatUpdated.subscribe((chat) => {
      this.chats[0] = chat;
      this.loadMessages();
    });
  }

  logout(){
    this.cs.socket.disconnect();
    localStorage.clear();
    this.router.navigate(['login']);
  }

  send() {
    let mes = new Message;
    mes.createMessage(localStorage.getItem('loggedInUser'), this.chats[0], $('#message').val(), this.date, false);
    //$('#m-list').append('<li style="color:green;">' + message['from'] + ': ' + message['body'] + '</li>');
    this.cs.socket.emit('message', mes);
    this.messages.push(mes);
    $('#message').val('');
    setTimeout(this.updateScroll, 100);
  }

  loadMessages(){
    this.cs.getMessages(this.user, this.chats[0])
      .subscribe(response => {
        console.log(response);
        response = JSON.parse(response);
        this.messages = [];
        console.log(response);
        for (let i = 0; i<response.length; i++) {
          var mes = new Message;
          mes.createMessage(response[i].from_name, response[i].to_name, response[i].message, response[i].time, response[i].seen, response[i]._id);
          this.messages.push(mes);
        }
        setTimeout(this.updateScroll, 100);
        console.log(this.messages);
      });
  }

  updateScroll(){
    var element = document.getElementById('chat-messages');
    element.scrollTop = element.scrollHeight;
  }



}
