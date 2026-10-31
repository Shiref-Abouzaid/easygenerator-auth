import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

export interface PublicUser {
  id: string;
  email: string;
  name: string;
}

interface CreateUserData {
  email: string;
  name: string;
  passwordHash: string;
}

const DUPLICATE_KEY_ERROR_CODE = 11000;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(data: CreateUserData): Promise<UserDocument> {
    try {
      return await this.userModel.create(data);
    } catch (error) {
      if (
        error instanceof mongo.MongoServerError &&
        error.code === DUPLICATE_KEY_ERROR_CODE
      ) {
        throw new ConflictException({
          message: 'Email is already registered.',
          errors: [{ field: 'email', message: 'Email is already registered.' }],
        });
      }
      throw error;
    }
  }

  findByEmailWithPassword(email: string) {
    return this.userModel
      .findOne({ email: email.toLowerCase().trim() })
      .select('+passwordHash')
      .exec();
  }

  findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  toPublic(user: UserDocument): PublicUser {
    return { id: user._id.toString(), email: user.email, name: user.name };
  }
}
