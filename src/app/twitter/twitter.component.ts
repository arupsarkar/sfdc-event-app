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
  tweets: Tweet[] = [];
  ids = [];

  constructor(private twitter: TwitterService) { }

  ngOnInit() {
    this.twitter.getTwitterUserDetails().subscribe(
      (user) => {
        this.user = user.data;
        this.getTweets();
      }
    );
  }

  getTweets() {
    this.twitter.getTweets().subscribe( tweets => {
      tweets.data.forEach( tweet => {
        if (this.ids.indexOf(tweet.id_str) < 0) {
          this.ids.push(tweet.id_str);
          this.tweets.unshift(tweet);
        }
      });
    });
  }

}
