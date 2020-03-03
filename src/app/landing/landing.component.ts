import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, Params} from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }


  gotoContacts(): void {
    this.router.navigate(['/contacts']).then(r => { console.log(new Date(), 'redirecting to contacts page ' + r ); });
  }


  gotoPlatformEvents(): void {
    this.router.navigate(['/events']).then(r => { console.log(new Date(), 'redirecting to events page ' + r ); });
  }

  gotoTwitter(): void {
    this.router.navigate(['/twitter']).then(r => { console.log(new Date(), 'redirecting to twitter page ' + r ); });
  }
}
