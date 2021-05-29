import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/x/tasks.module';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { UpdateAppModule } from './modules/update-app/update-app.module';
import { FileModule } from './modules/file/file.module';
@Module({
  imports: [
    ConfigModule.load(resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    TasksModule,
    AuthModule,
    PostsModule,
    UpdateAppModule,
    FileModule,
  ],
  providers: [],
})
export class AppModule {}
