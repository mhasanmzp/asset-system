import { AuthService } from '../../services/auth.service';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

import Peer from 'peerjs';

@Component({
  selector: 'app-chatrooms',
  templateUrl: './chatrooms.page.html',
  styleUrls: ['./chatrooms.page.scss'],
})
export class ChatroomsPage implements OnInit {
  @ViewChild('videoPlayer', { static: false }) videoPlayer: ElementRef;
  peer: Peer;
  mediaConnection: any;
  peerId: string;
  stream: MediaStream;
  constructor(
    public authService: AuthService
  ) { }


  ngOnInit() {
    this.peer = new Peer({
      host: this.authService.apiPeerUrl,
      port: 4000,
      secure: true,
      path: '/server',
      debug: 3,
      config: {
        'iceServers': [
          { url: 'stun:stun.l.google.com:19302' }
        ]
      }
    });


    this.peer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
    });


   

    this.peer.on("call", (call) => {
     

    });
  }

  ionViewDidLoad() {



  }


  async newPeer() {


    console.log("  ionViewDidLoad ");

    const video = this.videoPlayer.nativeElement;
   

    const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });

    


  }

  answerCall() {

  }

  async connect(peerId) {

    


    
    

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });


    this.peer.on('open', async () => {

      let call = this.peer.call(peerId, stream);

      call.on("stream", (remoteStream) => {
        
      });

    });



   
  }

  connectToPeer(peerId: string) {
    const conn = this.peer.connect(peerId);

    conn.on('data', (data) => {
    });
  }

}
