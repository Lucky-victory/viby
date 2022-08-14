import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable,of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelGuard implements CanActivate {
  constructor(private router:Router) {
    
  }
  canActivate(): Observable<boolean> {
    this.getChannelId().subscribe((id) => {
      this.router.navigate(['channels/'+id])
    })
    // this.router.navigate(['channels'])
    return of(false);
  }
  getChannelId():Observable<number> {
    return of(2)
  }
  
}
