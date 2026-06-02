import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({ example: 'How to Build a Blogging Platform' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'A comprehensive guide', required: false })
  @IsString()
  @IsOptional()
  subtitle?: string;

  @ApiProperty({ example: '# Introduction\n\nThis is a tutorial...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 'https://example.com/cover.jpg', required: false })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiProperty({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @ApiProperty({
    example: ['typescript', 'nestjs'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  tags?: string[];
}
