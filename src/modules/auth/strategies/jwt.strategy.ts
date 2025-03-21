import {
  ExtractJwt,
  Strategy,
  StrategyOptions,
  StrategyOptionsWithoutRequest,
  StrategyOptionsWithRequest,
} from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    } as StrategyOptionsWithRequest);
  }

  async validate(payload: any) {
    return {
      id: payload.id,
      email: payload.email,
      full_name: payload.full_name,
    };
  }
}
