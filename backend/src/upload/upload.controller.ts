import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
} from "@nestjs/swagger";
import { UploadService } from "./upload.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

// Magic bytes for image validation
function validateImageMagicBytes(buffer: Buffer): boolean {
  const header = Array.from(buffer.slice(0, 12));

  // Check JPEG (FF D8 FF)
  if (header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) {
    return true;
  }

  // Check PNG (89 50 4E 47)
  if (
    header[0] === 0x89 &&
    header[1] === 0x50 &&
    header[2] === 0x4e &&
    header[3] === 0x47
  ) {
    return true;
  }

  // Check GIF (47 49 46)
  if (header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46) {
    return true;
  }

  // Check WebP (RIFF at 0-3, WEBP at 8-11)
  if (
    header[0] === 0x52 &&
    header[1] === 0x49 &&
    header[2] === 0x46 &&
    header[3] === 0x46 &&
    header[8] === 0x57 &&
    header[9] === 0x45 &&
    header[10] === 0x42 &&
    header[11] === 0x50
  ) {
    return true;
  }

  return false;
}

@ApiTags("upload")
@Controller("upload")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post("image")
  @ApiOperation({ summary: "Upload an image" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor("image", {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1,
      },
      fileFilter: (req, file, callback) => {
        // Validate MIME type
        const allowedMimeTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              "Invalid file type. Only images are allowed",
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    // Validate magic bytes to ensure it's actually an image
    if (!validateImageMagicBytes(file.buffer)) {
      throw new BadRequestException(
        "Invalid file format. File does not match image signature",
      );
    }

    const url = await this.uploadService.uploadImage(file);

    return {
      url,
      message: "Image uploaded successfully",
    };
  }
}
