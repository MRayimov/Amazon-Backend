import { IsJWT, IsString } from 'class-validator';

export class RefreshDto {
  @IsString()
  @IsJWT()
  refreshToken: string;
}
