import { userModel } from './../userModel';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { IonicStorageService } from 'src/Storage';
import { CrudService } from '../services/crud.service';

@Component({
  selector: 'app-editamount',
  templateUrl: './editamount.page.html',
  styleUrls: ['./editamount.page.scss'],
})
export class EditamountPage implements OnInit {
  id: any;

  userModel = {} as userModel;
  userData: any;
  email: any;

  constructor(
    private actRoute: ActivatedRoute,
    private fireStore: AngularFirestore,
    private router: Router,
    private loadingCtrl: LoadingController,
    private storage: IonicStorageService,
    private event: CrudService
  ) {
    this.id = this.actRoute.snapshot.paramMap.get('id');
    console.log(this.id);
  }

  ngOnInit() {
    this.getAccountDetailsById(this.id);
  }

  getAccountDetailsById(id: any) {
    this.fireStore
      .doc('registeredUsers/' + id)
      .valueChanges()
      .subscribe((data: any) => {
        this.userModel.name = data['name'];
        this.userModel.email = data['email'];
        this.userModel.phone = data['phone'];
        this.userModel.cash = data['cash'];
        this.userModel.password = data['password'];
        this.userModel.confirmPassword = data['confirmPassword'];
      });
  }

  async updateUserModel(userModel: any) {
    console.log(userModel);
    console.log(this.id);
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 3000,
    });

    loading.present();
    this.fireStore.doc('registeredUsers/' + this.id).update(userModel);

    this.addLocalStorage();
    this.router.navigate(['/home']);
  }

  addLocalStorage() {
    this.storage.store('userData', this.userData).then((res) => {
      this.storage.store('email', this.email).then((res) => {
        // this.event.sendMessage({
        //   accountHolderLoggedInUser: this.userData,
        // });
        this.router.navigate(['/home']);
      });
    });
  }
}
