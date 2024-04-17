import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleCloudService {
  private clientSecretManager: SecretManagerServiceClient;

  constructor(private readonly config: ConfigService) {
    this.clientSecretManager = new SecretManagerServiceClient();
  }

  async accessGoogleCloudSecretFile(name: string, version = 'latest') {
    try {
      const projectId = this.config.get('google.projectId');
      if (!projectId) {
        throw 'Project ID is not defined';
      }
      const fullName = `projects/${projectId}/secrets/${name}/versions/${version}`;
      const [response] = await this.clientSecretManager.accessSecretVersion({ name: fullName });
      const payload = response.payload?.data?.toString();

      return payload ? JSON.parse(payload) : undefined;
    } catch (error) {
      throw new BadRequestException(
        `Could not access Google Cloud Secret Manager. Error description: ${error}`,
      );
    }
  }
}
