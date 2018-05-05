import * as admin from "firebase-admin";
admin.initializeApp();

export const db: admin.firestore.Firestore = admin.firestore();
export const storage: admin.storage.Storage = admin.storage();
