import { IsString, IsNotEmpty } from 'class-validator';

export class RegionTranslationDto {
  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
