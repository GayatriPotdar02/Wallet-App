import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CrudService {
  constructor(
    public firestore: AngularFirestore,
    public auth: AngularFireAuth,
    private http: HttpClient
  ) {}

  loginWithEmail(data: any) {
    return this.auth.signInWithEmailAndPassword(data.email, data.password);
  }

  signup(data: any) {
    return this.auth.createUserWithEmailAndPassword(data.email, data.password);
  }

  saveDetails(data: any) {
    return this.firestore.collection('registeredUsers').doc(data.uid).set(data);
  }


  getDetails(data: any) {
    return this.firestore
      .collection('registeredUsers')
      .doc(data.uid)
      .valueChanges();
  }



  private subject = new Subject<any>();

  sendMessage(text: any) {
    this.subject.next(text);
  }


  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }


  sendMoney(data:any){
    return this.firestore.collection('transactions').doc(data.uid).set(data);
  }


  getAllTransactionDetails(data: any) {
    return this.firestore
      .collection('transactions')
      .doc(data.uid)
      .valueChanges();
  }


  receiveMoney(data:any){
    return this.firestore.collection('receiverTransactions').doc(data.uid).set(data);
  }

}
