import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public loadingController: LoadingController, private fireauth: AngularFireAuth, private router: Router) {}

  logout() {
    this.fireauth.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    })
  }

}
