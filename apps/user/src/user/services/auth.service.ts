import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/users.model';
import { CreateUserDto } from '../dto/createUser.dto';
import { stringError } from '@app/shared/helpers/error.helpers';
import { LoginDto } from '../dto/login.dto';
import { UserService } from './user.service';
import { RpcException } from '@nestjs/microservices';
import { CryptoService } from './crypto.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User) private userRepository: typeof User,
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
        @Inject(forwardRef(() => CryptoService))
        private cryptoService: CryptoService
    ) { }

    async login(dto: LoginDto) {
        const { email, password } = dto
        const user = await this.userService.findOne({ email })

        if (!user) {
            throw new RpcException(stringError({ msg: "This user is not exist", statusCode: 404 }))
        }

        const isPassportCompare = await this.cryptoService.comparePassword(password, user.password)

        if (!isPassportCompare) {
            throw new RpcException(stringError({ msg: "Password does not match", statusCode: 404 }))
        }

        const userToken = await this.cryptoService.createToken(user.id, user.email)
        const hashedToken = await this.cryptoService.hashPassword(userToken)

        user.token = hashedToken
        await user.save()

        return {
            id: user.id,
            email: user.email,
            userName: user.userName,
            token: userToken
        }
    }

    async deleteUserToken(token: string, userId) {
        const user = await this.userService.findOne({ id: userId })
        
    }

    async checkUserToken(token: string) {
        const decodedToken = await this.cryptoService.verifyToken(token)

        console.log(decodedToken);

        const user = await this.userService.findOne({ id: decodedToken.userId })
        if (!user) {
            throw new RpcException(stringError({ msg: 'This user does not exist', statusCode: 404 }))
        }

        const compareTokens = await this.cryptoService.comparePassword(token, user.token)

        if (!compareTokens) {
            throw new RpcException(stringError({ msg: 'Token does not match', statusCode: 404 }))
        }
    }

}   
