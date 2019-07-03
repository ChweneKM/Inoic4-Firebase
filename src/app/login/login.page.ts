import { Component, OnInit, Directive, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { LoadingController, ToastController } from '@ionic/angular';
import {NavController} from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

@Directive({
  selector: '[show-hide-input]' // Attribute selector
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private fireauth: AngularFireAuth,
    private router: Router,
    public loadingController: LoadingController,
    public alertController: AlertController, private formBuilder: FormBuilder, private nvCtrl: NavController) {
  }

  ngOnInit() {

    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),


      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),

    });
  }

  isActiveToggleTextPassword: Boolean = true;
  passwordIcon: string = 'eye-off';
  // @HostBinding() type: any;
  // @Input('appTargetInput') targetInput: any;

  validations_form: FormGroup;
  errorMessage = '';
  successMessage = '';

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 6 characters long.' },
      
    ]
  };

  public toggleTextPassword(): void{
    this.isActiveToggleTextPassword = (this.isActiveToggleTextPassword=== true)?false:true;
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}
  public getType() {
      return this.isActiveToggleTextPassword ? 'password' : 'text';
  }

  async openLoader() {
    const loading = await this.loadingController.create({
      message: 'Please Wait ...',
      duration: 2000
    });
    await loading.present();
  }
  async closeLoading() {
    return await this.loadingController.dismiss();
  }

  login() {
    this.fireauth.auth.signInWithEmailAndPassword(this.email, this.password)
      .then(res => {
        console.log(res + 'sometext');
        this.errorMessage = '';
        this.nvCtrl.navigateForward('/home');
      }, err => {
        this.errorMessage = err.message;
      });
  }


}
