import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from './schema/auth.schema';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() user: User) {
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() user: User) {
    const { username, password, firstname, lastname, companyName } = user;
    return this.authService.register(
      username,
      password,
      firstname,
      lastname,
      companyName,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.authService.getUserByUsername(req.user.username);
    return user;
  }
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Request() req) {
    return this.authService.googleLogin(req);
  }

  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() updateData: Partial<User>) {
    const updatedUser = await this.authService.updateUserById(id, updateData);
    if (!updatedUser) {
      return 'Usuario no encontrado';
    }
    return updatedUser;
  }
}
