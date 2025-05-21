import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { IUser } from '../user/interface/user.interface';
import { UserService } from '../user/user.service';

const ENCRYPTION_KEY = Buffer.from(process.env.PASSWORD_ENCRYPTION_KEY); // 32 bytes
const IV_LENGTH = 16;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  private encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  private decrypt(text: string): string {
    const parts = text.split(':');
    const iv = Buffer.from(parts.shift()!, 'hex');
    const encryptedText = parts.join(':');
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  async createUser(username: string, password: string): Promise<IUser> {
    const hashed = await bcrypt.hash(password, 10);
    const encrypted = this.encrypt(hashed);
    const user: IUser = {
      _id: crypto.randomUUID(),
      username,
      password: encrypted,
    };
    const res = await this.userService.createUser(user);
    //return jwt for user
    const payload = { sub: res._id, username: res.username };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '8h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });
    return { ...res, accessToken, refreshTokens: [refreshToken] };
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<IUser | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    const hashed = this.decrypt(user.password);
    const isMatch = await bcrypt.compare(password, hashed);
    return isMatch ? user : null;
  }

  async login(
    username: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.validateUser(username, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const payload = { sub: user._id, username: user.username };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async refresh(token: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userService.getUserById(payload.sub);
      if (!user) throw new UnauthorizedException();
      return {
        accessToken: this.jwtService.sign(
          { sub: user._id, username: user.username },
          { expiresIn: '8h' },
        ),
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return await this.userService.getUserByUsername(username);
  }
}
