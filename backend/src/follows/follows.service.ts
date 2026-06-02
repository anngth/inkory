import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from '../entities/follow.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async toggle(followingId: string, followerId: string) {
    if (followingId === followerId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const userToFollow = await this.userRepository.findOne({
      where: { id: followingId },
    });

    if (!userToFollow) {
      throw new NotFoundException('User not found');
    }

    const existingFollow = await this.followRepository.findOne({
      where: { followerId, followingId },
    });

    if (existingFollow) {
      // Unfollow
      await this.followRepository.remove(existingFollow);
      return { following: false, message: 'Unfollowed successfully' };
    } else {
      // Follow
      const follow = this.followRepository.create({
        followerId,
        followingId,
      });
      await this.followRepository.save(follow);
      return { following: true, message: 'Followed successfully' };
    }
  }

  async getFollowers(userId: string) {
    const follows = await this.followRepository.find({
      where: { followingId: userId },
      relations: {
        follower: true,
      },
    });

    return follows.map(follow => {
      const { password, ...user } = follow.follower;
      return user;
    });
  }

  async getFollowing(userId: string) {
    const follows = await this.followRepository.find({
      where: { followerId: userId },
      relations: {
        following: true,
      },
    });

    return follows.map(follow => {
      const { password, ...user } = follow.following;
      return user;
    });
  }

  async checkFollowing(followingId: string, followerId: string) {
    const follow = await this.followRepository.findOne({
      where: { followerId, followingId },
    });

    return { following: !!follow };
  }
}
