import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RpcStringError, stringError } from '@app/shared/helpers/error.helpers';
import { UserService } from './user.service';
import { RpcException } from '@nestjs/microservices';
import { CryptoService } from './crypto.service';
import { LoginDto } from '@app/shared/types/dto/userService.dto';

@Injectable()
export class AuthService {
    constructor(
        // @InjectModel(User) private userRepository: typeof User,
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
        @Inject(forwardRef(() => CryptoService))
        private cryptoService: CryptoService
    ) { }

    async login(dto: LoginDto) {
        const { email, password } = dto
        const user = await this.userService.findOne({ email })

        if (!user) {
            RpcStringError("Email or password are not correct", 400)
        }

        const isPassportCompare = await this.cryptoService.comparePassword(password, user.password)

        if (!isPassportCompare) {
            throw new RpcException(stringError({ msg: "Email or password are not correct", statusCode: 400 }))
        }

        const userToken = await this.cryptoService.createToken(user.id, user.email)
        const hashedToken = await this.cryptoService.hashPassword(userToken)

        user.token = hashedToken
        await user.save()

        return {
            statusCode: 200,
            data: {
                id: user.id,
                email: user.email,
                userName: user.userName,
                token: userToken
            }
        }
    }

    async deleteUserToken(userId) {
        const user = await this.userService.findOne({ id: userId })
        user.token = null
        await user.save()
        return { msg: 'User logged out', statusCode: 200 }
    }

    async checkUserToken(token: string) {
        const decodedToken = await this.cryptoService.verifyToken(token)

        console.log(decodedToken);

        const user = await this.userService.findOne({ id: decodedToken.userId })
        if (!user) {
            throw new RpcException(stringError({ msg: 'This user does not exist', statusCode: 400 }))
        }

        const compareTokens = await this.cryptoService.comparePassword(token, user.token)

        if (!compareTokens) {
            throw new RpcException(stringError({ msg: 'Token does not match', statusCode: 400 }))
        }

        return user.id
    }

    async auth(userId: number) {
        const user = await this.userService.findOne({ id: String(userId) })

        if (!user) {
            RpcStringError('User is not found', 400)
        }

        return {
            statusCode: 200,
            data: user
        }
    }
}   
