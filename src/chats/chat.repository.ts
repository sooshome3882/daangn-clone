import { NotFoundException } from '@nestjs/common';
import { CreateChatRoomDto } from './dto/createChatRoom.dto';
import { EntityManager, EntityRepository, getConnection, getRepository, Repository } from 'typeorm';
import { ChatRoom } from './chatRoom.entity';
import { Chat } from './chat.entity';
import { User } from 'src/users/user.entity';
import { CreateChatDto } from './dto/createChat.dto';

@EntityRepository(ChatRoom)
export class ChatRepository extends Repository<ChatRoom> {
  async createChatRoom(user: User, createChatRoomDto: CreateChatRoomDto) {
    const { post } = createChatRoomDto;
    const query = await getRepository(ChatRoom).createQueryBuilder('ChatRoom').insert().into(ChatRoom).values({ post, user }).execute();
    return query.raw.insertId;
  }

  async createChat(user: User, createChatDto: CreateChatDto) {
    const { chatRoom, chatting } = createChatDto;
    const query = await getRepository(Chat).createQueryBuilder('Chat').insert().into(Chat).values({ chatRoom, user, chatting }).execute();
    return query.raw.insertId;
  }
}
