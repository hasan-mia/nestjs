import { IsOptional, IsString } from 'class-validator';

export class PostDto {
  @IsString()
  public title: string;

  @IsOptional()
  @IsString()
  public description?: string;

  @IsOptional()
  public image?: string;
}
