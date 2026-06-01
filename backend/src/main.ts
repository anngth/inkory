import { NestFactory, Reflector } from "@nestjs/core";
import { ValidationPipe, ClassSerializerInterceptor } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable ClassSerializerInterceptor globally to respect @Exclude() decorators
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const port = process.env.PORT || 3000;

  // Swagger documentation - only enable in development
  const isProduction = process.env.NODE_ENV === "production";
  const enableSwagger = process.env.ENABLE_SWAGGER === "true" || !isProduction;

  if (enableSwagger) {
    const config = new DocumentBuilder()
      .setTitle("Inkory API")
      .setDescription("API documentation for Inkory blogging platform")
      .setVersion("1.0")
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);
    console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
  }

  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`🔒 Environment: ${process.env.NODE_ENV || "development"}`);
}

bootstrap();
