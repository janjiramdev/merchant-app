import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesModule } from './modules/roles/roles.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: 'mongodb://mongo:P%40ssw0rd@localhost:27017/datasource?authSource=admin',
      }),
    }),
    RolesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
