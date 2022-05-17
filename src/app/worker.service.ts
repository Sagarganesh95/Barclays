import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval } from 'rxjs';



@Injectable({
    providedIn: 'root'
})

export class WorkerService {
    constructor( public updates: SwUpdate, public snackBar: MatSnackBar) {
        if( updates.isEnabled){
            interval(1000*60).subscribe( 
                ()=> updates.checkForUpdate().then( ()=> console.log('checking for updates'))
            );
        }
    }

    public checkForUpdates() {
        // this.updates.available.subscribe( event => this.promptUser(event));
        this.updates.available.subscribe( event => {
            this.updates.activateUpdate().then( ()=> document.location.reload())
         })
    }
    
    private promptUser(e): void {
        let snackBarRef = this.snackBar.open(
            'A New Version of the app is available',
            'Refresh',
            { horizontalPosition: 'left'}
        );
        snackBarRef.onAction().subscribe(
             ()=> this.updates.activateUpdate().then( ()=> document.location.reload())
            );
    }
}