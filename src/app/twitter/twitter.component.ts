import { Component, OnInit } from '@angular/core';
import {TwitterService} from '../twitter.service';
import {Tweet} from '../model/Tweet';

@Component({
  selector: 'app-twitter',
  templateUrl: './twitter.component.html',
  styleUrls: ['./twitter.component.css']
})
export class TwitterComponent implements OnInit {
  user;
  constructor(private twitter: TwitterService) { }

  ngOnInit() {
    this.twitter.getTwitterUserDetails().subscribe(
      user => this.user = user.data
    );
  }

}
