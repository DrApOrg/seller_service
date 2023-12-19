import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/auth.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ username: username }).exec();
    if (user && (await bcrypt.compare(password, user.password))) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async register(
    username: string,
    password: string,
    firstname: string,
    lastname: string,
    companyName: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = new this.userModel({
      username: username,
      password: hashedPassword,
      firstname: firstname,
      lastname: lastname,
      companyName,
    });
    return createdUser.save();
  }

  async googleLogin(req: any) {
    if (!req.user) {
      return 'No user from Google';
    }

    const user = await this.userModel
      .findOne({ username: req.user.email })
      .exec();
    console.log(req.user);
    const fullName = req.user.name;
    const [firstname, ...lastnameArr] = fullName.split(' ');
    const lastname = lastnameArr.join(' ');

    if (!user) {
      const createdUser = new this.userModel({
        username: req.user.email,
        firstname,
        lastname,
        // Puedes configurar la contraseña para el usuario aquí o dejarla vacía
      });
      await createdUser.save();
    }
    const payload = { username: req.user.email, sub: req.user.id };
    return {
      message: 'User information from Google',
      access_token: this.jwtService.sign(payload),
    };
  }
  async getUserByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async updateUserById(
    userId: string,
    updateData: Partial<User>,
  ): Promise<User | null> {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true },
    );

    return updatedUser;
  }
}
