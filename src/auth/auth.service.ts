import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-creditionals.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async signUp(authCredentialsDto:AuthCredentialsDto):Promise <void>{
    return this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(authCredentialsDto:AuthCredentialsDto):Promise<{accessToken:string}>{
    const result = await this.userRepository.validateUserPassword(authCredentialsDto)
    if (!result){
      throw new UnauthorizedException('Invalid Credentials');
    }

    const payload:JwtPayload = {result}
    const accessToken = await this.jwtService.sign(payload)
    return {accessToken}
  }
}
