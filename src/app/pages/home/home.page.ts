import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { IonicStorageService } from 'src/Storage';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  display = '0';
  firstval: any = null;
  operator: any = null;
  newcursor = false;
  isc = false;
  iscomma = false;
  cash: any;
  name: any;
  email: any;
  public password: any;
  userData: any;
  user: any;

  totalBalance: any = '500';
  debitedAmount: any;
  remainingAmount: any;
  showLoggedInUser!: boolean;
  transactionHistory: any = [];
  dateTime: any;
  currentDate: any;
  chosenDate: any;
  totalBalanceAfterTransaction: any;
  loggedInUserCash: any;
  currentUserBankBalance: any;
  receiverTransactionHistory:any = [];

  constructor(
    private crudService: CrudService,
    private toastCtrl: ToastController,
    private storage: IonicStorageService,
    private router: Router,
    private event: CrudService,
    private loadingCtrl: LoadingController,
    public firestore: AngularFirestore,
    private alertController: AlertController
  ) {
    this.currentDate = new Date().toISOString();
    console.log(this.currentDate);


    this.storage.get('userData').then((data) => {
      console.log(data);
      if (data != null) {
        this.userData = data;
        console.log(this.userData.email);
      } else {
        this.router.navigate(['/login']);
      }
    });

    this.event.getMessage().subscribe((text: any) => {
      this.storage.get('userData').then((data) => {
        this.userData = data;
        if (this.userData != null) {
          this.showLoggedInUser = true;
        } else {
          this.showLoggedInUser = false;
        }
      });
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.dateTime = new Date().toISOString();
    });
    this.getAllTransactions();
   this.getAllReceiverTransactions();
  }

  checkBalance() {
    if (this.cash > this.userData.cash) {
      alert('Sorry, Your balance is low');
    } else {
      alert('Bahut paisa hai tumhare paas :)');
      this.send();
    }
  }

  async send() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 3000,
    });

    this.remainingAmount = this.userData.cash - this.cash;
    console.log(this.remainingAmount);
    this.userData.cash = this.remainingAmount;
    this.totalBalanceAfterTransaction = this.remainingAmount;
    console.log('Total balance after transaction');
    console.log(this.totalBalanceAfterTransaction);

    let receiverModel = {
      name: this.name,
      email: this.email,
      cash: this.cash,
      senderEmail: this.userData.email,
      senderName: this.userData.name,
      senderPhone: this.userData.phone,
      currentDate: this.currentDate,
    };

    console.log(receiverModel);
    loading.present();
    this.crudService.sendMoney(receiverModel).then((data: any) => {
      console.log(data);
    });

    this.firestore
      .collection('registeredUsers')
      .doc(this.userData.uid)
      .update({ cash: this.totalBalanceAfterTransaction });

    loading.dismiss();
    console.log('Balance update checking');

    this.storage.get('userData').then((data) => {
      console.log(data);

      var updateUserBalanceAfterTransaction = data;

      updateUserBalanceAfterTransaction.cash = this.totalBalanceAfterTransaction;

      this.storage
        .store('userData', updateUserBalanceAfterTransaction)
        .then((data) => {
          console.log(data);
          this.userData = data;
        });
    });

    this.addLocalStorage();
  }

  async getAllTransactions() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 8000,
    });

    loading.present();
    this.firestore
      .collection('transactions')
      .snapshotChanges()
      .subscribe((data) => {
        console.log(data);
        loading.dismiss();
        this.transactionHistory = data.map((e: any) => {
          return {
            id: e.payload.doc.id,
            email: e.payload.doc.data()['email'],
            name: e.payload.doc.data()['name'],
            cash: e.payload.doc.data()['cash'],
            senderEmail: e.payload.doc.data()['senderEmail'],
            senderName: e.payload.doc.data()['senderName'],
            senderPhone: e.payload.doc.data()['senderPhone'],
            currentDate: e.payload.doc.data()['currentDate'],
          };
        });
        console.log(this.transactionHistory);
      });
  }


  async deleteTransaction(id: string) {
    console.log(id);
    const loading = await this.loadingCtrl.create({
      message: 'Transaction history will be deleted',
      duration: 5000,
    });

    loading.present();
    console.log(id);
    this.firestore.doc('transactions/' + id).delete();
    loading.dismiss();
  }

  logOut() {
    this.storage.remove('userData').then((data) => {
      this.router.navigate(['/login']);
    });
  }

  editCash(id: any) {
    console.log(id);
    this.router.navigate(['/editamount/', id]);
  }

  // updateBalance() {
  //   console.log('Cash Update Zali');
  //   this.firestore
  //     .doc('registeredUsers/' + this.userData.uid)
  //     .update(this.userData.cash);
  //   //this.router.navigate(['/admin']);
  // }

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

  features: any[] = [
    {
      id: 1,
      name: 'Top Up',
      src: 'assets/icons/top-up.png',
      background: 'rgba(27,150,181, 0.1)',
      page: '',
    },
    {
      id: 2,
      name: 'Withdraw',
      src: 'assets/icons/cash-withdrawal.png',
      background: 'rgba(106,100,255, 0.1)',
      page: '',
    },
    {
      id: 3,
      name: 'Send',
      src: 'assets/icons/send.png',
      background: 'rgba(255, 196, 9, 0.1)',
      page: '',
    },
    {
      id: 4,
      name: 'Pay',
      src: 'assets/icons/debit-card.png',
      background: 'rgba(27,150,181, 0.1)',
      page: '',
    },
  ];

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'WHO AM I ?',
      subHeader: 'Hey, This is a friendly Wallet app !!!',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async presentLogoAlert() {
    const alert = await this.alertController.create({
      header: 'Avatar',
      subHeader:
        'I think we dont need this because already we have separate account details',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async getAllReceiverTransactions() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 8000,
    });

    loading.present();
    this.firestore
      .collection('receiverTransactions')
      .snapshotChanges()
      .subscribe((data) => {
        console.log(data);
        loading.dismiss();
        this.receiverTransactionHistory = data.map((e: any) => {
          return {
            id: e.payload.doc.id,
            email: e.payload.doc.data()['email'],
            name: e.payload.doc.data()['name'],
            cash: e.payload.doc.data()['cash'],
            receiverEmail: e.payload.doc.data()['receiverEmail'],
            receiverName: e.payload.doc.data()['receiverName'],
            receiverPhone: e.payload.doc.data()['receiverPhone'],
            currentDate: e.payload.doc.data()['currentDate'],
          };
        });
        console.log(this.receiverTransactionHistory);
      });
  }
}
