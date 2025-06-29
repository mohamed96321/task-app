import { IsString, IsNotEmpty } from 'class-validator';

export class CityTranslationDto {
  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
