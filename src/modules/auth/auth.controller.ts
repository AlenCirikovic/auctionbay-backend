import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Req, Res, BadRequestException, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LocalAuthGuard } from './guards/local.guard';
import { Prisma, User } from 'generated/prisma';
import { Response, Request } from 'express';  // Ensure this is correct
import { RequestWithUser } from 'src/interfaces/auth.interface';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private userService: UsersService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: Response): Promise<User> {
      const user = req.user;
      
      // Check if user exists before proceeding
      if (!user) {
        throw new BadRequestException('User not found.');
      }
    
      const access_token = await this.authService.login(user);  // This will be a string
      res.cookie('access_token', access_token, { httpOnly: true });
    
      return user;  // Return user object
    }
    

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() body: Prisma.UserCreateInput, @Res() res: Response) {
        return this.authService.register(body);
    }

    @Post('signout')
    @HttpCode(HttpStatus.OK)
    async signout(@Res({ passthrough: true }) res: Response): Promise<{ msg: string }> {
      res.clearCookie('access_token')
      return { msg: 'ok' }
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async me(@Req() req: Request): Promise<Omit<User, 'password'>> {
        const { password, ...other } = req.user as User;
        return other;
      }
      
}
