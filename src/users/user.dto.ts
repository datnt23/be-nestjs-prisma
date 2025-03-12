import { IsInt } from 'class-validator';

export class GetIdDTO {
  @IsInt()
  id: number;
}
