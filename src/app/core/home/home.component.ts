import { Component, OnInit, ElementRef, ViewChild, Renderer, Inject, trigger, state, style, transition, animate, keyframes, AnimationTransitionEvent, HostListener, HostBinding } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { StatusbarComponent } from '../statusbar/statusbar.component';
import { CardComponent } from '../card/card.component';
import { LauncherComponent } from '../launcher/launcher.component';
import { AppConfig } from '../../shared/interfaces';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
	animations: [
		trigger('action', [
			state('inactive', style({
				opacity: 0
			})),
			state('active', style({
				opacity: 0
			})),
			transition('inactive => active', [
				animate(400, keyframes([
					style({opacity: 0, offset: 0}),
					style({opacity: 1, offset: .5}),
					style({opacity: 0, offset: 1}),
				]))
			])
		])
	]
})
export class HomeComponent implements OnInit {
	isCardView: boolean = true;
	isMoved: boolean = false;
	isLauncherOpen: boolean = false;
	scrollPosition: number = 0;
	apps: AppConfig[] = [];
	quickLaunchApps: any[];
	appName: string;
	navStateLeft: string = 'inactive';
	navStateCenter: string = 'inactive';
	navStateRight: string = 'inactive';
	@ViewChild('cardsContainer') scroller: ElementRef;
	document: Document;
	@HostBinding('style.height') viewportHeight: string = window.innerHeight + 'px';

	constructor(private _rd: Renderer, private pageScrollService: PageScrollService) {
		this.document = document;
		PageScrollConfig.defaultIsVerticalScrolling = false;
	}

	scrollToNearestPanel(): void {
		var position = this.scroller.nativeElement.scrollLeft;
		let childPositions = [];
		for (let i = 0; i < this.scroller.nativeElement.children.length; i++) {
			childPositions.push({
				id: this.scroller.nativeElement.children[i].id,
				offset: this.scroller.nativeElement.children[i].offsetLeft,
				width: this.scroller.nativeElement.children[i].clientWidth
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

		let pageScrollInstance: PageScrollInstance = PageScrollInstance.advancedInstance(this.document, '#' + scrollTo, [this.scroller.nativeElement], "", false, 0, true, null, time);

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
		this.apps = [
			// {id: 'foxcasts', title: 'FoxCasts', url: 'http://preview.foxcasts.com', iconUrl: 'assets/icons/foxcasts.png'},
			// {id: 'dash-weather', title: 'Dash Weather', url: 'https://dashweather.choorp.com', iconUrl: 'assets/icons/dash-weather.png'},
		];

		this.quickLaunchApps = [
			{id: 'phone', title: 'Phone', url: '', iconUrl: 'assets/icons/phone-64.png'},
			{id: 'browser', title: 'Web', url: '', iconUrl: 'assets/icons/browser-64.png'},
			{id: 'foxcasts', title: 'FoxCasts', url: 'https://foxcasts.garredow.com', iconUrl: 'assets/icons/foxcasts-256.png'},
			{id: 'dash-weather', title: 'Dash Weather', url: 'https://dashweather.garredow.com', iconUrl: 'assets/icons/dash-weather-64.png'},
			{id: 'launcher', title: 'App 5', url: '', iconUrl: 'assets/icons/launcher-phone.png'},
		];
	}

	navHome() {
		this.navStateCenter = 'active';
		this.navStateRight = 'active';
		this.navStateLeft = 'active';

		if (this.isLauncherOpen) {
			this.isLauncherOpen = false;
		} else if (this.isCardView && this.apps.length > 0) {
			// console.log('Going out of card view');
			this.isCardView = false;
		} else {
			// console.log('Going into card view');
			this.appName = '';
			this.isCardView = true;
		}
	}

	navBack() {
		this.navStateRight = 'active';

		setTimeout(() => {
			this.navStateCenter = 'active';
		}, 100);

		setTimeout(() => {
			this.navStateLeft = 'active';
		}, 200);
	}

	navForward() {
		this.navStateLeft = 'active';

		setTimeout(() => {
			this.navStateCenter = 'active';
		}, 100);

		setTimeout(() => {
			this.navStateRight = 'active';
		}, 200);
	}

	animationDone(ev: AnimationTransitionEvent, button) {
		if (ev.toState === 'active') {
			this[button] = 'inactive';
		}
	}

	openApp(app: AppConfig) {
		let activeIDs:string[] = this.apps.map(a => a.id);

		if (app.id === 'launcher') {
			this.isLauncherOpen = true;
		} else {
			if (activeIDs.indexOf(app.id) == -1) {
				// this.isMoved = true;
				// let apptoLaunch: AppConfig = this.allApps.find(a => a.id === app.id);
				// console.log('launching ', apptoLaunch);
				this.apps.push(app);
			}

		}
	}

	openAppFromLauncher(app) {
		this.isLauncherOpen = false;

		let timer = setTimeout(() => {
			this.openApp(app);
		}, 350);
	}

	closeApp(app:AppConfig) {
		let index: number = this.apps.findIndex((x: AppConfig) => x.id === app.id);
		this.apps.splice(index, 1);
	}

	appLaunched() {
		this._rd.setElementProperty(this.scroller.nativeElement, 'scrollLeft', (this.apps.length-1) * window.outerWidth);
		// this.isMoved = true;


		// setTimeout(() => {
		// 	this._rd.setElementProperty(this.scroller.nativeElement, 'scrollLeft', (this.apps.length-1) * window.outerWidth);
		// }, 400);

		setTimeout(() => {
			this.isCardView = false;
		}, 1000);

		// setTimeout(() => {
		// 	this.isCardView = false;
		// 	this.isMoved = false;
		// }, 1200);
	}

	viewFullScreen(ev: any) {
		console.log('viewFullScreen:', ev);
		this.isCardView = false;
		this.appName = ev.title;
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		// console.log('onResize', event.target.innerHeight);
		this.viewportHeight = event.target.innerHeight + 'px';
	}
}
