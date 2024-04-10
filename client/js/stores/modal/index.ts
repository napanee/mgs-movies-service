import {makeAutoObservable} from 'mobx';


export class Modal {
	constructor() {
		makeAutoObservable(this);
	}

	content: React.ReactElement | null = null;

	get isOpen() {
		return !!this.content;
	}

	open(content: React.ReactElement) {
		this.content = content;
	}

	close() {
		this.content = null;
	}
}
