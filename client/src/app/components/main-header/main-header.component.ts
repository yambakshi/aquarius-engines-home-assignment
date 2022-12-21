import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { RouterService } from '@services/router.service';

@Component({
    selector: 'main-header',
    templateUrl: './main-header.component.html',
    styleUrls: [
        './main-header.component.common.scss',
        './main-header.component.mobile.scss'
    ],
    encapsulation: ViewEncapsulation.None
})
export class MainHeaderComponent {
    @Output() public sidenavToggle = new EventEmitter();

    constructor(public routerService: RouterService) { }

    onToggleSidenav(): void {
        this.sidenavToggle.emit();
    }
}