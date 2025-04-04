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

export type JwtPayload = {
  id: string;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    } as StrategyOptionsWithRequest);
  }

  async validate(payload: JwtPayload) {
    return {
      id: payload.id,
      email: payload.email,
    };
  }
}
