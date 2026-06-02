import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        articles: true,
        followers: true,
        following: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userWithoutPassword } = user;

    return {
      ...userWithoutPassword,
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
      articlesCount: user.articles?.length || 0,
    };
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);

    const { password, ...result } = user;
    return result;
  }

  async getUserByUsername(username: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.username',
        'user.bio',
        'user.avatar',
        'user.createdAt',
      ])
      .addSelect(
        subQuery =>
          subQuery
            .select('COUNT(follower.id)', 'count')
            .from('follow', 'follower')
            .where('follower.followingId = user.id'),
        'followersCount',
      )
      .addSelect(
        subQuery =>
          subQuery
            .select('COUNT(following.id)', 'count')
            .from('follow', 'following')
            .where('following.followerId = user.id'),
        'followingCount',
      )
      .addSelect(
        subQuery =>
          subQuery
            .select('COUNT(article.id)', 'count')
            .from('article', 'article')
            .where('article.authorId = user.id'),
        'articlesCount',
      )
      .where('user.username = :username', { username })
      .getRawAndEntities();

    if (!user.entities[0]) {
      throw new NotFoundException('User not found');
    }

    return {
      ...user.entities[0],
      followersCount: parseInt(user.raw[0]?.followersCount) || 0,
      followingCount: parseInt(user.raw[0]?.followingCount) || 0,
      articlesCount: parseInt(user.raw[0]?.articlesCount) || 0,
    };
  }
}
