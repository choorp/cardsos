import { Component, OnInit, Input, Output, Inject, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { AppsService } from '../apps.service';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';
import { AppConfig } from '../../shared/interfaces';

@Component({
	selector: 'app-launcher',
	templateUrl: './launcher.component.html',
	styleUrls: ['./launcher.component.css'],
})
export class LauncherComponent implements OnInit {
	@Input() isCardView: boolean = true;
	appName: string;
	panels: any[];
	isReady: boolean = false;
	@Output() onOpenApp = new EventEmitter<Object>();
	document: Document;

	@ViewChild('container') container: ElementRef;

	constructor(private _appsService: AppsService, private pageScrollService: PageScrollService) {
		this.document = document;
		PageScrollConfig.defaultIsVerticalScrolling = false;
	}

	scrollToNearestPanel(): void {
		var position = this.container.nativeElement.scrollLeft;
		let childPositions = [];
		for (let i = 0; i < this.container.nativeElement.children.length; i++) {
			childPositions.push({
				id: this.container.nativeElement.children[i].id,
				offset: this.container.nativeElement.children[i].offsetLeft,
				width: this.container.nativeElement.children[i].clientWidth
			})
		}

		let scrollTo: string;
		let distance: number = 0;
		for (let i = 0; i < childPositions.length; i++) {
			let child = childPositions[i];
			let nextChild = childPositions[i + 1];

			let threshold: number = child.offset + child.width * .6;
			if (position < threshold) {
				scrollTo = child.id;
				distance = Math.abs(position - child.offset);
				break;
			}
		}

		let time: number = distance / childPositions[0].width * 300;
		if (time < 40) {
			time = 40;
		}

		let pageScrollInstance: PageScrollInstance = PageScrollInstance.advancedInstance(this.document, '#' + scrollTo, [this.container.nativeElement], "", false, 0, true, null, time);

		this.pageScrollService.start(pageScrollInstance);
	}

	private scrollTimer = null;
	logScroll(ev) {
		if (this.scrollTimer != null) {
			clearTimeout(this.scrollTimer);
		}
		this.scrollTimer = setTimeout(() => {
			// console.log('scrollend', ev);
			this.scrollToNearestPanel();
		}, 75);
	}

	ngOnInit() {
		// console.log('launcher', this._appsService.apps);
		this.panels = [
			{
				title: 'Applications', apps: [
					{ id: 'calculator', title: 'Calculator', url: '', iconUrl: 'assets/icons/calculator-64.png' },
					{ id: 'calendar', title: 'Calendar', url: '', iconUrl: 'assets/icons/calendar-64.png' },
					{ id: 'clock', title: 'Clock', url: '', iconUrl: 'assets/icons/clock-64.png' },
					{ id: 'contacts', title: 'Contacts', url: '', iconUrl: 'assets/icons/contacts-64.png' },
					{ id: 'email', title: 'Email', url: '', iconUrl: 'assets/icons/email-64.png' },
					{ id: 'messaging', title: 'Messaging', url: '', iconUrl: 'assets/icons/messaging-64.png' },
					{ id: 'notes', title: 'Notes', url: '', iconUrl: 'assets/icons/notes-64.png' },
					{ id: 'phone', title: 'Phone', url: '', iconUrl: 'assets/icons/phone-64.png' },
				]
			},
			{
				title: 'Garrett\'s Apps', apps: [
					{id: 'foxcasts', title: 'FoxCasts', url: 'https://foxcasts.garredow.com', iconUrl: 'assets/icons/foxcasts-256.png'},
					{id: 'dash-weather', title: 'Dash Weather', url: 'https://dashweather.garredow.com', iconUrl: 'assets/icons/dash-weather-64.png'},
				]
			},
			{
				title: 'System', apps: [
					{ id: 'wifi', title: 'Wi-Fi', url: '', iconUrl: 'assets/icons/wifi-64.png' },
					{ id: 'bluetooth', title: 'Bluetooth', url: '', iconUrl: 'assets/icons/bluetooth-64.png' },
					{ id: 'screenlock', title: 'Screen & Lock', url: '', iconUrl: 'assets/icons/screenlock-64.png' },
					{ id: 'accounts', title: 'Accounts', url: '', iconUrl: 'assets/icons/accounts-64.png' },
					{ id: 'updates', title: 'System Updates', url: '', iconUrl: 'assets/icons/updates-64.png' },
					{ id: 'backup', title: 'Backups', url: '', iconUrl: 'assets/icons/backup-64.png' },
					{ id: 'exhibition', title: 'Exhibition', url: '', iconUrl: 'assets/icons/exhibition-64.png' },
					{ id: 'vpn', title: 'VPN', url: '', iconUrl: 'assets/icons/vpn-64.png' },
					{ id: 'location', title: 'Location Services', url: '', iconUrl: 'assets/icons/location-64.png' },
					{ id: 'textassist', title: 'Text Assist', url: '', iconUrl: 'assets/icons/textassist-64.png' },
					{ id: 'sound', title: 'Sound Settings', url: '', iconUrl: 'assets/icons/sound-64.png' },
					{ id: 'datetime', title: 'Date & Time', url: '', iconUrl: 'assets/icons/datetime-64.png' },
					{ id: 'devmode', title: 'Dev Mode', url: '', iconUrl: 'assets/icons/devmode-64.png' },
				]
			},
		];

		this.isReady = true;
	}

	goToPreviousPanel(currentIndex) {
		if (currentIndex > 0) {
			this.goToPanel(currentIndex-1);
		}
	}

	goToNextPanel(currentIndex) {
		if (currentIndex + 1 < this.panels.length) {
			this.goToPanel(currentIndex+1);
		}
	}

	goToPanel(index) {
		let pageScrollInstance: PageScrollInstance = PageScrollInstance.advancedInstance(this.document, '#panel' + index, [this.container.nativeElement], "", false, 0, true, null, 200);
		this.pageScrollService.start(pageScrollInstance);
	}

	openApp(app: AppConfig) {
		this.onOpenApp.emit(app);
	}
}
