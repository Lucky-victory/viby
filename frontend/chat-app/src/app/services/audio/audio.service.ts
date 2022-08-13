import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private _audio= new Audio();
  
  constructor() { 

  }
  setSrc(src: string): void{
    this._audio.src = src;
    
  }
  play():Promise<void> {
    return this._audio.play()
  }
  pause():void {
    this._audio.pause();
  }
  stop():void {
    this._audio.pause();
    this._audio.currentTime = 0;
  }
  get currentTime() {
    return this._audio.currentTime;
  }
  set currentTime(time:number) {
    this._audio.currentTime=time;
  }
  get paused() {
    return this._audio.paused;
  }
  get duration() {
    return this._audio.duration;
  }
  get isLoading() {
   return this._audio.networkState=== this._audio.NETWORK_LOADING
  }
  on(eventName: string, cb: (event:Event) => void) {
    this._audio.addEventListener(eventName, (evt) => {
      
      cb(evt);
    })
  }
  secondsToTime(seconds:number):string{
    if(!seconds) return '00:00';
const add0=(num:number):string=>(num < 10 ? '0'+num :''+num);
const secondsInOneHour:number=3600;
const hour:number=Math.floor(seconds / secondsInOneHour );
const minute:number=Math.floor((seconds - hour * secondsInOneHour) / 60);
const sec=Math.floor(seconds - hour * secondsInOneHour - minute  * 60);

return (
    (hour > 0 ? [hour,minute,sec] : [minute,sec]).map(add0).join(':')
)
  }
  set storePlayTime(time:number) {
    localStorage.setItem('viby_audio', JSON.stringify(time));
  }
  get playTime():number {
    return JSON.parse(localStorage.get('viby_audio')) as number
  }
}
