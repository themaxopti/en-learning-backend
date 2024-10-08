import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/users.model';
import { CryptoService } from './crypto.service';
import { RpcStringError } from '@app/shared/helpers/error.helpers';
import { CreateUserDto } from '@app/shared/types/dto/userService.dto';

interface FindUserDto {
  email?: string
  userName?: string
  id?: string
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @Inject(forwardRef(() => CryptoService))
    private readonly cryptoService: CryptoService
  ) { }

  async findOne(dto: FindUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        ...dto
      }
    })

    if (user) {
      return user
    }
    return null
  }

  async checkIfUserExist(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email
      }
    })

    if (user) {
      return true
    }
    return false
  }

  async create(dto: CreateUserDto) {
    const { email, userName, password } = dto
    const isUserExist = await this.checkIfUserExist(email)
    if (isUserExist) {
      throw RpcStringError('This user is already exist', HttpStatus.FORBIDDEN)
    }
    const hashedPassword = await this.cryptoService.hashPassword(password)
    const user = await this.userRepository.create({ email, userName, password: hashedPassword })
    return user
  }


}
