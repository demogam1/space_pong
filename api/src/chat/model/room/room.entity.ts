import { UserEntity } from "src/user/model/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { JoinedRoomEntity } from "../joined-room/joined-room.entity";
import { MessageEntity } from "../message/message.entity";
import { BlockedUser } from "../blockedUser.interface";

@Entity()
export class RoomEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({nullable: true})
	description: string;

	@Column({nullable: true})
	privateMessage: boolean;

	@Column({nullable: true})
	isPrivate: boolean;

	@Column({select: false, nullable: true})
	channelPassword: string;

	@ManyToOne(() => UserEntity, user => user.roomsOwner)
	@JoinColumn()
	owner: UserEntity;

	@ManyToMany(() => UserEntity)
	@JoinTable()
	users: UserEntity[];

	@ManyToMany(() => UserEntity)
	@JoinTable()
	admins: UserEntity[];

	@Column({ type: 'jsonb', default: [] })
	muted: BlockedUser[];

	@Column({ type: 'jsonb', default: [] })
	baned: BlockedUser[];

	@OneToMany(() => JoinedRoomEntity, joinedRoom => joinedRoom.room)
	joinedUsers: JoinedRoomEntity[];

	@OneToMany(() => MessageEntity, message => message.room)
	messages: MessageEntity[];

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}