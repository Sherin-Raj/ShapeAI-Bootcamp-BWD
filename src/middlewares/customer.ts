import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  use(req: any, res: any, next: () => void) {
    console.log('Middleware executed'); // Log middleware execution

    const token = req.get('Authorization');
    console.log('Authorization header:', token); // Log the Authorization header

    if (token) {
      const cookie = token.split(' ')[1].replace(/"/g, '');

      try {
        const secret = this.configService.get<string>(process.env.JWT_SECRET);
        console.log('JWT Secret:', secret); // Log the secret key

        const decoded = this.jwtService.verify(cookie, { secret }) as {
          userId: string;
        };

        req.user = decoded;
        next();
      } catch (error) {
        console.log('JWT verification error:', error); // Log the error if JWT verification fails
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Invalid or expired token' });
      }
    } else {
      console.log('No Authorization token found'); // Log when no Authorization token is found
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Authentication required' });
    }
  }
}
