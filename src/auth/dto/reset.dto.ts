import { IsOptional } from 'class-validator';

export class ResetDto {
  @IsOptional()
  id?: number;
}
