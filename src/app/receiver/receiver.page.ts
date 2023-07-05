import { Component, OnInit } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { IonicStorageService } from 'src/Storage';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-receiver',
  templateUrl: './receiver.page.html',
  styleUrls: ['./receiver.page.scss'],
})
export class ReceiverPage implements OnInit {

  cash!: number;
  name: any;
  email: any;
  currentDate: any;
  userData: any;
  remainingAmount: any;
  totalBalanceAfterTransaction: any;
  chosenDate: any;
  receiverName:any;
  receiverEmail:any;
  receiverPhone:any;
  updateUserCash!: number;


  constructor(private crudService: CrudService,
    private toastCtrl: ToastController,
    private storage: IonicStorageService,
    private router: Router,
    private event: CrudService,
    private loadingCtrl: LoadingController,
    public firestore: AngularFirestore,
    private alertController: AlertController) {
      this.currentDate = new Date().toISOString();
    console.log(this.currentDate);
    this.chosenDate = this.currentDate;

    this.storage.get('userData').then((data) => {
      console.log(data);
      if (data != null) {
        this.userData = data;
        console.log(this.userData.email);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit() {
  }


  async send() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 3000,
    });

    // this.remainingAmount = this.userData.cash - this.cash;
    // console.log(this.remainingAmount);
    // this.userData.cash = this.remainingAmount;
    // this.totalBalanceAfterTransaction = this.remainingAmount;
    // console.log('Total balance after transaction');
    // console.log(this.totalBalanceAfterTransaction);

    let receiverModel = {
      name: this.name,
      email: this.email,
      cash: this.cash,
      receiverEmail: this.receiverEmail,
      receiverName: this.receiverName,
      receiverPhone: this.receiverPhone,
      currentDate: this.currentDate,
    };

    console.log(receiverModel);
    loading.present();
     this.crudService.receiveMoney(receiverModel).then((data: any) => {
       console.log(data);
     });
    
   this.updateUserCash =  Number(this.userData.cash) + Number(this.cash);
   console.log(this.updateUserCash);
     this.firestore
        .collection('registeredUsers')
        .doc(this.userData.uid)
       .update({ cash: this.updateUserCash });

       this.storage.get('userData').then((data) => {
        console.log(data);
  
        var totalBalanceAfterTransaction = data;
  
        totalBalanceAfterTransaction.cash = this.updateUserCash;
  
        this.storage
          .store('userData', totalBalanceAfterTransaction)
          .then((data) => {
            console.log(data);
            this.userData = data;
          });
      });

       this.addLocalStorage();

       this.router.navigate(["/home"]);
    // loading.dismiss();
    // console.log('Balance update checking');

    // this.storage.get('userData').then((data) => {
    //   console.log(data);

    //   var totalBalanceAfterTransaction = data;

    //   totalBalanceAfterTransaction.cash = this.totalBalanceAfterTransaction;

    //   this.storage
    //     .store('userData', totalBalanceAfterTransaction)
    //     .then((data) => {
    //       console.log(data);
    //       this.userData = data;
    //     });
    // });
    // 
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
}
