import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { Platform, AlertController } from '@ionic/angular';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import {NavController} from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  email: string = '';
  password: string = '';
  confirm_password: string = '';
  error: string = '';
  username: string = '';
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
      { type: 'minlength', message: 'Password must be atleast 6 characters long.' },
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirmation is required.' },
      { type: 'equalto', message: 'Passwords dont match.' }

    ]
  };
  
  constructor(private fireauth: AngularFireAuth, private router: Router, private toastController: ToastController, private platform: Platform, public loadingController: LoadingController,
    public alertController: AlertController, private formBuilder: FormBuilder, private nvCtrl: NavController) {

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

  
  registerUser() {
    this.fireauth.auth.createUserWithEmailAndPassword(this.email, this.password)
      .then((res => {
        console.log(res);
        this.nvCtrl.navigateRoot('/home');
        this.errorMessage = '';
        this.successMessage = 'Your account has been created.';
      }), err => {
        console.log(err);
        this.errorMessage = err.message;
        this.successMessage = '';
      });
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
      confirm_password: new FormControl('', Validators.compose([

        Validators.required,
        this.equalto('password')
      ])),

    },

    );

  }

  equalto(field_name): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {

    const input = control.value;

    const isValid = control.root.value[field_name] === input;
    if (!isValid) {
    return { 'equalTo': {isValid} };
    } else {
    return null;
    }
    };
 }

}
