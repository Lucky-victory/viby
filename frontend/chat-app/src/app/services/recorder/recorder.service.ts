import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioRecorderService {
  recorder: MediaRecorder | null;
 streamBeingCaptured:MediaStream| null;
  audioBlobs: Blob[];
  private fileReader = new FileReader();
  constructor() { }

  private hasSupport() {
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      return Promise.reject(
        new Error("Your browser lacks support for the mediaDevices API")
      );
    }
    return Promise.resolve(true);
  }
   start() {
    // return new Promise(()=>{});
    return this.hasSupport()
      .then((value) => this.handleSuccess(value))
      .catch(this.handleError);
  }
  /**
   * @returns {Promise<Blob>}
   */
  stop() {
    return new Promise((resolve) => {
      let mimeType = this.recorder?.mimeType;
      this.recorder?.addEventListener("stop", () => {
        const audioBlob = new Blob(this.audioBlobs, { type: mimeType });
        console.log(audioBlob);
        resolve(audioBlob);
      });
      this.cancel();
    });
  }
  resume() {
    this.start();
  }
  cancel() {
  
    this.recorder.stop();

    this.stopStream();
  }
  stopStream() {
    this.streamBeingCaptured.getTracks().forEach((track) => track?.stop());
  }
  reset() {
    this.recorder = null;
    this.streamBeingCaptured = null;
  }

  handleSuccess = (isSupported:boolean) => {
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
    return;
  };
  handleError = (error) => {
    console.log(error);
  };

  beginStream = (stream:MediaStream) => {
    this.recorder = new MediaRecorder(stream);
    this.streamBeingCaptured = stream;

    this.recorder.addEventListener("dataavailable", (event) => {
      this.audioBlobs.push(event.data);
    });
    this.recorder?.start();
    console.log(stream);
  };
}
