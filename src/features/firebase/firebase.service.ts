import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import admin from 'firebase-admin';

import { errorMessages } from '@/features/common';
import { UsersService } from '@/features/users';

@Injectable()
export class FirebaseService {
  private clientSecretManager: SecretManagerServiceClient;
  private useGoogleCloudSecret: boolean;
  private credentialsFilePathOrSecretName: string;
  private databaseURL: string;

  constructor(private readonly usersService: UsersService, private readonly config: ConfigService) {
    this.clientSecretManager = new SecretManagerServiceClient();

    this.useGoogleCloudSecret = this.config.get<boolean>('firebase.useGoogleCloudSecret', false);
    this.credentialsFilePathOrSecretName = this.config.get<string>(
      'firebase.credentialsFilePathOrSecretName',
      '',
    );
    this.databaseURL = this.config.get<string>('firebase.databaseURL', '');
  }

  // Access secret from Google Cloud Secret Manager
  private async accessGoogleCloudSecret(name: string, version = 'latest') {
    try {
      const projectId = this.config.get('google.projectId');
      if (!projectId) {
        throw 'Project ID is not defined';
      }
      const fullName = `projects/${projectId}/secrets/${name}/versions/${version}`;
      const [response] = await this.clientSecretManager.accessSecretVersion({ name: fullName });
      const payload = response.payload?.data?.toString();

      if (payload) {
        return JSON.parse(payload);
      }

      return payload;
    } catch (error) {
      // TODO: add logger
      throw new BadRequestException('Could not access Google Cloud Secret Manager.');
    }
  }

  public async initializeFirebaseAdmin() {
    // TODO: add logger for unsuccessful initialization
    if (!admin.apps.length) {
      // Use Google Cloud Secret Manager to store credentials on Production
      const cert = this.useGoogleCloudSecret
        ? await this.accessGoogleCloudSecret(this.credentialsFilePathOrSecretName)
        : this.credentialsFilePathOrSecretName;

      if (cert) {
        admin.initializeApp({
          credential: admin.credential.cert(cert),
          databaseURL: this.databaseURL,
        });
      } else {
        throw new BadRequestException('Could not initialize Firebase Admin.');
      }
    }
  }

  public async getCustomToken(userId: string) {
    const user = await this.usersService.findOne(userId);
    try {
      return await admin.auth().createCustomToken(user.id);
    } catch (error) {
      throw new BadRequestException(errorMessages.firebaseTokenGenerateError);
    }
  }
}
