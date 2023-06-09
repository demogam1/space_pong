import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ɵbypassSanitizationTrustResourceUrl } from '@angular/core';
import { ChatService } from '../../services/chat-service/chat.service';
import { UserI } from 'src/app/model/user.interface';
import { Observable } from 'rxjs';
import { Router, NavigationExtras } from '@angular/router';
import { PlayerService } from 'src/app/private/user/services/player.service';


@Component({
	selector: 'app-member-option',
	templateUrl: './member-option.component.html',
	styleUrls: ['./member-option.component.scss']
})
export class MemberOptionComponent implements OnInit {

	@Output() valueChanged = new EventEmitter<boolean>();
	@Output() divHeight = new EventEmitter<number>();
	@Input() selectedUser: UserI;
	@ViewChild('maDiv') maDiv: ElementRef;

	isOwner: boolean = true;
	isAdmin: boolean = true;
	isBlocked: boolean = null;
	myDateTimeValue: string;
	banOption: boolean = false;
	muteOption: boolean = false;






	constructor(public chatService: ChatService, private router : Router, private playerService: PlayerService) { }
	
	
	ngOnInit(): void {
		this.chatService.getIfBlocked().subscribe(toto => this.isBlocked = toto);
		this.chatService.checkBlocked();
		if (!this.chatService.selectedRoomOwner)
			this.isOwner = false;
		if (!this.chatService.selectedRoomAdmin)
			this.isAdmin = false;
	}

	isValidDateTime() {
	  const now = new Date();
	  const selectedDateTime = new Date(this.myDateTimeValue);
	  return selectedDateTime > now;
	}


	ngAfterViewInit() {
		this.divHeight.emit(this.maDiv.nativeElement.offsetHeight);
	}

	onClick() {
		this.valueChanged.emit(false);
	}

	banTime() {
		this.chatService.banFromRoom({baned: {id: this.selectedUser.id, date: new Date(this.myDateTimeValue)}, user: this.selectedUser});
	  }

	  muteTime() {
		this.chatService.addMuted({id: this.selectedUser.id, date: new Date(this.myDateTimeValue)});
	  }

	checkUser() {
		return (this.chatService.selectedRoomOwner || this.chatService.selectedRoomAdmin)
			&& this.selectedUser.id !== this.chatService.currentUser.id
			&& this.selectedUser.id !== this.chatService.selectedRoom.owner.id
	}

	checkUserOwnerOnly() {
		return this.chatService.selectedRoomOwner && this.selectedUser.id !== this.chatService.currentUser.id
	}

	checkIfAdmin() {
		if (this.chatService.selectedRoom.admins.find(toto => toto.id === this.selectedUser.id))
			return true
		else
			return false
	}

	checkIfMuted() {
		if (this.chatService.selectedRoom.muted.find(toto => toto.id === this.selectedUser.id))
			return true
		else
			return false
	}

	checklvl() {
		if (this.isOwner)
			return true
		return !this.checkIfAdmin();
	}

	giveOwnership() {
		this.chatService.giveOwnership(this.selectedUser);
	}

	promote() {
		this.chatService.addAdmin(this.selectedUser);
	}

	demote() {
		this.chatService.removeAdmin(this.selectedUser);
	}

	mute() {
		this.chatService.addMuted({id: this.selectedUser.id, date: null});
	}

	unMute() {
		this.chatService.removeMuted(this.selectedUser);
	}
	
	kick() {
		this.chatService.quitRoom(this.selectedUser);
	}

	block() {
		this.chatService.blockUser(this.selectedUser, this.chatService.selectedRoom);
		// if (this.chatService.selectedRoom.privateMessage)
		// 	this.chatService.deleteRoom();
	}
	
	unBlock() {
		this.chatService.unBlockUser(this.selectedUser, this.chatService.selectedRoom);
	}

	showban() {
		this.banOption = true;
	}

	showmute() {
		this.muteOption = true;
	}

	ban() {
		this.chatService.banFromRoom({baned: {id: this.selectedUser.id, date: null}, user: this.selectedUser});

	}

	inviteToGame() 
	{
		this.router.navigate(['private/game/invite'], { queryParams: { functionName: 'Create' } });
		this.chatService.gameRoom.subscribe(room =>
		{
			this.chatService.sendMessage({ text: "Game Invite", room: this.chatService.selectedRoom, gameRoom: room });
		});
	}

	userProfile() {
		this.playerService.goToProfileOf(this.selectedUser);
	}

	addFriend() {

	}

}
