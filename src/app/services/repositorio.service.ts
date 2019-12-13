import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class RepositorioService {

  constructor(
    private db: AngularFirestore
  ) { }

  create(record) {
    return this.db.collection('expresiones').add(record);
  }

  read() {
    return this.db.collection('expresiones').snapshotChanges();
  }

  update(recordID, record) {
    this.db.doc('expresiones/' + recordID).update(record);
  }

  delete(record_id) {
    this.db.doc('expresiones/' + record_id).delete();
  }
}
