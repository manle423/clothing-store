import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global validation to automatically validate DTOs and send messages on validation errors
  app.useGlobalPipes(new ValidationPipe());

  // Set a global prefix for all routes in the application
  app.setGlobalPrefix('api');

  // Use cookie-parser middleware to parse cookies from incoming requests
  app.use(cookieParser());

  // Enable Cross-Origin Resource Sharing (CORS) to allow requests from a specific origin
  app.enableCors({
    // Specify the origin allowed to access the server
    origin: `http://${process.env.APP_HOST}:${process.env.APP_PORT}`, 
    credentials: true, // Allow credentials (cookies, authorization headers) to be included in requests
  });

  // Start the application and listen on the specified port from environment variables
  await app.listen(process.env.APP_PORT);
}

// Call the bootstrap function to start the application
bootstrap();
