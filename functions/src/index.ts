import * as functions from "firebase-functions";
import app from "./app";
import { updateRegionPage } from "./materialize";

exports.app = functions.https.onRequest(app);

// Update region pages whenever any document used on the page changes
exports.onRegionChange = functions.firestore.document("regions/{id}").onWrite((change, context) => updateRegionPage(context.params.id));
exports.onLocationChange = functions.firestore
  .document("locations/{id}")
  .onWrite((change, context) => updateRegionPage(change.after ? change.after.get("region") : change.before.get("region")));
exports.onRoomChange = functions.firestore
  .document("rooms/{id}")
  .onWrite((change, context) => updateRegionPage(change.after ? change.after.get("region") : change.before.get("region")));
