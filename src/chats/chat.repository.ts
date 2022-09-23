import { NotFoundException } from '@nestjs/common';
import { CreateChatRoomDto } from './dto/createChatRoom.dto';
import { EntityManager, EntityRepository, getConnection, getRepository, Repository } from 'typeorm';
import { ChatRoom } from './chatRoom.entity';
import { Chat } from './chat.entity';
import { User } from 'src/users/user.entity';
import { CreateChatDto } from './dto/createChat.dto';

@EntityRepository(ChatRoom)
export class ChatRepository extends Repository<ChatRoom> {
  async getChatListOfOneChatRoom(user: User, chatRoomId: number) {
    return await getRepository(Chat)
      .createQueryBuilder('chat')
      .innerJoinAndSelect('chat.chatRoom', 'chatRoom')
      .innerJoinAndSelect('chat.user', 'user')
      .where('chatRoom.chatRoomId = :chatRoomId', { chatRoomId })
      .andWhere('user = :user', { user })
      .orderBy('chat.createdAt', 'ASC')
      .getMany();
  }

  async getChatRoomByPostAndUser(user: User, postId: number) {
    return await getRepository(ChatRoom)
      .createQueryBuilder('chatRoom')
      .innerJoinAndSelect('chatRoom.post', 'post')
      .innerJoinAndSelect('chatRoom.user', 'user')
      .where('post = : postId', { postId })
      .andWhere('user = :userName', { userName: user.phoneNumber })
      .orderBy('chatRoom.createdAt', 'DESC')
      .getOne();
  }

  async getChatById(chatId: number) {
    return await getRepository(Chat).createQueryBuilder('chat').innerJoinAndSelect('chat.chatRoom', 'chatRoom').innerJoinAndSelect('chat.user', 'user').where('chatId = :chatId', { chatId }).getMany();
  }

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
