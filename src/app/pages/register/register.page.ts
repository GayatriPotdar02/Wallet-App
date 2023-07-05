import { Router } from '@angular/router';
import { CrudService } from './../../services/crud.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  name: any;
  email: any;
  phone: any;
  cash: any;
  password: any;
  confirmPassword: any;
  showEditOption: boolean = false;

  constructor(
    private crudService: CrudService,
    private router: Router,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  signup() {
    this.crudService
      .signup({ email: this.email, password: this.password })
      .then(
        (res: any) => {
          if (res.user.uid) {
            let data = {
              email: this.email,
              password: this.password,
              name: this.name,
              phone: this.phone,
              confirmPassword: this.confirmPassword,
              cash: this.cash,
              showEditOption: this.showEditOption,
              uid: res.user.uid,
            };
            this.crudService.saveDetails(data).then(
              async (res: any) => {
                const loading = await this.loadingCtrl.create({
                  message: 'Please Wait...',
                  duration: 1000,
                  spinner: 'circles',
                });

                loading.present();
                const toast = await this.toastCtrl.create({
                  message: 'Account created successfully',
                  duration: 2000,
                });

                await toast.present();

                this.router.navigate(['/login']);
              },
              (err: any) => {
                console.log(err);
              }
            );
          }
        },
        async (err: { message: any }) => {
          alert(err.message);
          const toast = await this.toastCtrl.create({
            message: err.message,
            duration: 8000,
          });

          await toast.present();

          console.log(err);
        }
      );
  }
}
