import { IsInt, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CityTranslationDto } from './city-translation.dto';

export class CreateCityDto {
  @IsInt()
  region_id: number;

  @ValidateNested({ each: true })
  @Type(() => CityTranslationDto)
  @ArrayMinSize(1)
  translations: CityTranslationDto[];
}
