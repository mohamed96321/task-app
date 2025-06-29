import { IsInt, IsString, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { RegionTranslationDto } from './region-translation.dto';

export class CreateRegionDto {
  @IsInt()
  capital_city_id: number;

  @IsString()
  code: string;

  @IsInt()
  population: number;

  @ValidateNested({ each: true })
  @Type(() => RegionTranslationDto)
  @ArrayMinSize(1)
  translations: RegionTranslationDto[];
}
