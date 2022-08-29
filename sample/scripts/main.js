export class AudioRecorder {
  constructor() {
    /**
     * @type {MediaRecorder|null}
     */
    this.recorder = null;
    this.streamBeingCaptured = null;
    this.audioBlobs = [];
  }
  /**
   * @returns {Promise<void>}
   */
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
        const audioBlob = new File(this.audioBlobs, "new-file.webm", {
          type: mimeType,
        });
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
    // @ts-ignore
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
  /**
   *
   * @returns {Promise<boolean>}
   */
  hasSupport() {
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      return Promise.reject(
        new Error("Your browser lacks support for the mediaDevices API")
      );
    }
    return Promise.resolve(true);
  }
  /**
   *
   * @param {boolean} isSupported
   * @returns
   */
  handleSuccess = (isSupported) => {
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

  beginStream = (stream) => {
    this.recorder = new MediaRecorder(stream);
    this.streamBeingCaptured = stream;

    this.recorder.addEventListener("dataavailable", (event) => {
      this.audioBlobs.push(event.data);
    });
    this.recorder?.start();
    console.log(stream);
  };
}

const fileReader = new FileReader();
const player = new Audio();
player.controls = true;
document.body.appendChild(player);
const rec = new AudioRecorder();
const startBtn = document.createElement("button");
startBtn.textContent = "start rec";
startBtn.addEventListener("click", () => {
  rec.start();
});
document.body.appendChild(startBtn);
const resBtn = document.createElement("button");
resBtn.textContent = "resume rec";
resBtn.addEventListener("click", () => {
  rec.resume();
});
document.body.appendChild(resBtn);
const stopBtn = document.createElement("button");
stopBtn.textContent = "stop rec";
stopBtn.addEventListener("click", () => {
  rec.stop().then((blob) => {
    console.log(blob);
    fileReader.readAsDataURL(blob);
    fileReader.onload = (event) => {
      const result = event.target?.result;
      console.log(result);

      player.src = result;
    };
  });
});
document.body.appendChild(stopBtn);
