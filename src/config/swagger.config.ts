import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const configureSwagger = (app: INestApplication, configService: ConfigService) => {
  const appName = configService.get<string>('app.name', '');
  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(`The ${appName} app API description`)
    .setVersion('v1')
    .addTag(
      'Health',
      'This section contains endpoints that can be used to check the health of the API.',
    )
    .addTag(
      'Auth',
      'This section contains endpoints that are used for authentication. For example, there are endpoints for logging in and signing up for the API.',
    )
    .addTag(
      'Admin',
      'This section contains endpoints that are used for the admin panel and will require an admin role.',
    )
    .addTag('Users', 'This section contains endpoints that can be used to manage users by API.')
    .addTag(
      'Profile',
      'This section contains endpoints that can be used by the currently logged user to manage his profile. For example, there are endpoints for getting and updating user information.',
    )
    .addTag(
      'Soft skills',
      'This section is related to managing information about the soft skills of users.',
    )
    .addTag(
      'Subscriptions',
      'This section is related to managing information about the subscriptions of users.',
    )
    .addBearerAuth({
      type: 'http',
      description:
        'JWT Authorization header using the Bearer scheme. </br>' +
        'Enter your token (without the "Bearer" word) in the text input below.',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const swaggerUiRoute = 'docs';

  SwaggerModule.setup(swaggerUiRoute, app, document, { swaggerOptions: { docExpansion: 'none' } });
};

export default configureSwagger;
