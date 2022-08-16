import { Injectable } from '@angular/core';
import * as mm from 'music-metadata-browser';
import { Buffer } from 'buffer';

@Injectable({
  providedIn: 'root'
})
export class AudioRecorderService {
 private recorder: MediaRecorder | null;
 private streamBeingCaptured:MediaStream| null;
  private audioBlobs: Blob[] = [];
  private audioBlob: Blob;
  private readonly fileReader = new FileReader();
  constructor() { }

  private async hasSupport() {
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      return Promise.reject(
        new Error("Your browser lacks support for recorder API")
      );
    }
    return Promise.resolve(true);
  }
   start() {
    
    return this.hasSupport()
      .then((isSupported) => this.handleSuccess(isSupported))
      .catch(this.handleError);
  }
  
  stop():Promise<File|Blob>  {
    return new Promise(async (resolve) => {
      const mimeType = this.recorder?.mimeType;
      
      this.recorder?.addEventListener("stop",() => {
        const arr = new Blob(this.audioBlobs, { type: mimeType }).slice(0,-1,);
    const f = new File(this.audioBlobs, 'record.webm', { type: mimeType
        });
        console.log(f);
        
       resolve(f);
      });
     this.cancel();
      
    });
  }
  resume() {
    this.start();
  }
 async cancel() {
  
    this.stopStream();
    this.recorder?.stop();
  }
  stopStream() {
    this.streamBeingCaptured.getTracks().forEach((track) => track.stop());
  }
  reset() {
    this.recorder = null;
    this.streamBeingCaptured = null;
  }

  private handleSuccess (isSupported:boolean) {
    if (isSupported) {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then((stream) => {
          console.log("record started");
          this.beginStream(stream);
        });
    }

  };
 private handleError = (error) => {
    console.log(error);
  };

  private beginStream (stream:MediaStream){
    this.recorder = new MediaRecorder(stream);
    this.streamBeingCaptured = stream;

    this.recorder?.start();
    this.recorder.addEventListener("dataavailable", (event) => {
      this.audioBlobs.push(event.data);
      
    });
  
  };
  getBlobOrBase64(blob:Blob|File,cb:(data: Blob | (string | ArrayBuffer)) => void, base64: boolean = true):void {
  
    if (!base64) return cb(blob);

    this.fileReader.readAsDataURL(blob)
   this.fileReader.onload = (event:ProgressEvent<FileReader>) => {
     cb(event.target?.result)
      
   }
   
  }

}
