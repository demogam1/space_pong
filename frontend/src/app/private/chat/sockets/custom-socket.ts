import { Injectable } from "@angular/core";
import { Socket, SocketIoConfig } from "ngx-socket-io";
import { tokenGetter } from "src/app/app.module";

@Injectable({providedIn: 'root'})
export class CustomSocket extends Socket {

	constructor() {
		const config: SocketIoConfig = { 
			url: `${window.location.protocol}//${window.location.hostname}:3000`, 
			options: {
				extraHeaders: {
					Authorization : tokenGetter()
				}
			} 
		};
		super(config);
	}
}