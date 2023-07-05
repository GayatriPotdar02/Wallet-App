import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { IonicStorageService } from 'src/Storage';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public email: any;
  public password: any;
  userData: any;
  name: any;
  user: any;
  constructor(
    private crudService: CrudService,
    private toastCtrl: ToastController,
    private storage: IonicStorageService,
    private router: Router,
    private event: CrudService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  async login() {
    this.crudService
      .loginWithEmail({ email: this.email, password: this.password })
      .then(
        async (res: any) => {
          const loading = await this.loadingCtrl.create({
            message: 'Please Wait...',
            duration: 1000,
            spinner: 'circles',
          });

          loading.present();
          console.log(res);
          if (res.user.uid) {
            this.crudService.getDetails({ uid: res.user.uid }).subscribe(
              async (res: any) => {
                const toast = await this.toastCtrl.create({
                  // message: 'Login Successfully',
                  duration: 2000,
                });

                await toast.present();

                this.userData = res;
                console.log(this.userData);
                this.addLocalStorage();
                this.storage.store('userData', this.userData).then((data) => {
                  this.router.navigate(['/home']);
                });
              },
              async (err: any) => {
                const toast = await this.toastCtrl.create({
                  message: 'Invalid Email Id or Password',
                  duration: 2000,
                });

                await toast.present();
                console.log(err);
              }
            );
          }
        },
        async (err: any) => {
          const toast = await this.toastCtrl.create({
            message: err.message,
            duration: 8000,
          });

          await toast.present();
          console.log(err);
        }
      );
  }

  addLocalStorage() {
    this.storage.store('userData', this.userData).then((res) => {
      this.storage.store('email', this.email).then((res) => {
        this.router
          .navigateByUrl('/home', { skipLocationChange: true })
          .then(() => {
            this.event.sendMessage({
              accountHolderLoggedInUser: this.userData,
            });
            this.router.navigate(['/home']);
          });
      });
    });
  }

  signup() {
    this.router.navigateByUrl('register');
  }
}
