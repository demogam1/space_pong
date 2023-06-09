import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { MessageEntity } from 'src/chat/model/message/message.entity';
import { MessageI } from 'src/chat/model/message/message.interface';
import { RoomI } from 'src/chat/model/room/room.interface';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {

	constructor(
		@InjectRepository(MessageEntity)
		private readonly messageRepository: Repository<MessageEntity>
	) {}

	async create(message: MessageI): Promise<MessageI> {
		return	this.messageRepository.save(this.messageRepository.create(message));
	}

	async findMessagesForRoom(room: RoomI) {
		const query = this.messageRepository
		.createQueryBuilder('message')
		.leftJoin('message.room', 'room')
		.where('room.id = :roomId', {roomId: room.id})
		.leftJoinAndSelect('message.user', 'user')
		.orderBy('message.created_at', 'ASC');

		return (query.getMany());
	}

	async deleteByRoomId(roomId: number) {
		await this.messageRepository
    		.createQueryBuilder()
    		.delete()
   	 		.from('message_entity')
    		.where('roomId = :roomId', { roomId })
    		.execute();
	}
}
