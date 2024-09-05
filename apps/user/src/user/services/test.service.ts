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

@Injectable()
export class TestService {
    constructor(
        // private readonly jwtService: JwtService,
        // private readonly authService: AuthService,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
    ) { }
   
}
