import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    const secret = configService.get("JWT_SECRET");

    if (!secret) {
      throw new Error(
        "JWT_SECRET is not defined in environment variables. Cannot initialize JWT strategy.",
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      select: [
        "id",
        "email",
        "username",
        "bio",
        "avatar",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
