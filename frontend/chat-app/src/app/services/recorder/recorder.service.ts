import { Injectable } from '@angular/core';

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
  
  stop():Promise<Blob> {
    return new Promise((resolve) => {
      let mimeType = this.recorder?.mimeType;
      this.recorder?.addEventListener("stop", () => {
        this.audioBlob = new Blob(this.audioBlobs, { type: mimeType });
        console.log(this.audioBlob);
      
        resolve(this.audioBlob);
      });
      this.cancel();
    });
  }
  resume() {
    this.start();
  }
  cancel() {
  
    this.recorder?.stop();
    this.stopStream();
  }
  stopStream() {
    this.streamBeingCaptured.getTracks().forEach((track) => track?.stop());
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
      console.log(this.audioBlobs);
      
    });
    console.log(stream);
  };
  getBlobOrBase64(cb:(data: Blob | (string | ArrayBuffer)) => void, base64: boolean = true):void {
  
    if (!base64) return cb(this.audioBlob);

    this.fileReader.readAsDataURL(this.audioBlob);
   this.fileReader.onload = (event:ProgressEvent<FileReader>) => {
     cb(event.target?.result)
      
   }
   
  }

}
