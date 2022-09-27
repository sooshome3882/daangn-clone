import { ChatComplaints } from './chatComplaints.entity';
import { CreateChatComplaintsDto } from './dto/createChatComplaints.dto';
import { UserComplaints } from 'src/chats/userComplaints.entity';
import { CreateUsersComplaintsDto } from './dto/createUsersComplaints.dto';
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

  async reportUserFromChat(user: User, createUsersComplaintsDto: CreateUsersComplaintsDto): Promise<number> {
    const { subjectUserName, complaintReason } = createUsersComplaintsDto;
    const query = await getRepository(UserComplaints)
      .createQueryBuilder('UserComplaints')
      .insert()
      .into(UserComplaints)
      .values({
        complaintReason,
        complaintUserName: user,
        subjectUserName,
      })
      .execute();
    return query.raw.insertId;
  }

  async reportChat(user: User, createChatComplaintsDto: CreateChatComplaintsDto) {
    const { chat, complaintReason } = createChatComplaintsDto;
    const query = await getRepository(ChatComplaints)
      .createQueryBuilder('ChatComplaints')
      .insert()
      .into(ChatComplaints)
      .values({
        chat,
        complaintReason,
        user,
      })
      .execute();
    return query.raw.insertId;
  }
}
