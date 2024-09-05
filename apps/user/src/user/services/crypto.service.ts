import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/users.model';
import { CreateUserDto } from '../dto/createUser.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { stringError } from '@app/shared/helpers/error.helpers';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { TestService } from './test.service';

@Injectable()
export class CryptoService {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(forwardRef(() => TestService))
        private readonly testService: TestService,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService
    ) { }

    async hashPassword(password: string) {
        return await bcrypt.hash(password, 11)
    }

    async comparePassword(passOne, passTwo) {
        return await bcrypt.compare(passOne, passTwo)
    }

    async createToken(userId: string | number, email: string) {
        return this.jwtService.signAsync({ userId, email }, { expiresIn: '1m' })
    }

    async hashToken(token: string) {
        return bcrypt.hash(token, 11)
    }

    async verifyToken(token) {
        try {
            return this.jwtService.verifyAsync(token).catch(async (e) => {
                const userData = await this.jwtService.decode(token)
                const user = await this.userService.findOne({ id: userData.userId })
                if (user) {
                    user.token = null   
                    await user.save()   
                }
                throw new RpcException(stringError({ msg: 'Token is not valid', statusCode: 404 }))
            })
        } catch (e) {
            throw new RpcException(stringError({ msg: 'Token is not valid', statusCode: 404 }))
        }
    }
}
