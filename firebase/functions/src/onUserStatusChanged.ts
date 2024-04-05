/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as logger from 'firebase-functions/logger';
import { onValueWritten } from 'firebase-functions/v2/database';

const ROOT_DIR_PRESENCE = 'users_online';

initializeApp();

// Since this code will be running in the Cloud Functions environment
// we call initialize Firestore without any arguments because it
// detects authentication from the environment.
const firestore = getFirestore();

const onUserStatusChanged = onValueWritten(
  { ref: '/status/{uid}', region: 'us-central1' },
  async (event) => {
    // Get the data written to Realtime Database
    const eventStatus = event.data.after.val();
    const userId = event.params.uid;

    // Then use other event data to create a reference to the
    // corresponding Firestore document.
    const userStatusFirestoreRef = firestore.doc(`${ROOT_DIR_PRESENCE}/${userId}`);

    // It is likely that the Realtime Database change that triggered
    // this event has already been overwritten by a fast change in
    // online / offline status, so we'll re-read the current data
    // and compare the timestamps.
    const statusSnapshot = await event.data.after.ref.once('value');
    const status = statusSnapshot.val();

    logger.info(status, eventStatus, { structuredData: true });

    // If the current timestamp for this data is newer than
    // the data that triggered this event, we exit this function.
    if (status.lastChanged > eventStatus.lastChanged) {
      return null;
    }

    // Otherwise, we convert the lastChanged field to a Date
    eventStatus.lastChanged = new Date(eventStatus.lastChanged);

    return userStatusFirestoreRef.set(eventStatus, { merge: true });
  },
);

export default onUserStatusChanged;
