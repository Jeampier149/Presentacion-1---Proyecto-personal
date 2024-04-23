import { Component,NgZone ,ViewChild,ElementRef, Output, EventEmitter} from '@angular/core';
import {Modal} from 'bootstrap';
@Component({
  selector: 'app-modal-tomar-foto',
  templateUrl: './modal-tomar-foto.component.html',
  styleUrl: './modal-tomar-foto.component.scss'
})
export class ModalTomarFotoComponent {
  loading:boolean=false
  prevArchivo: any='';
  files: any[] = [];
  showVideo = false;

  @Output() capturarImagen = new EventEmitter<File>();

  @ViewChild('modalTomarFoto') modalFoto!: any;
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  constructor(private zone: NgZone){}

  ngAfterViewInit() {
   this.modalFoto = new Modal(this.modalFoto.nativeElement, {
       backdrop: 'static',
       keyboard: false
   });
 }

 ngOnInit(): void {
  this.startCamera();
}

startCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      if (this.videoElement) {
        this.videoElement.nativeElement.srcObject = stream;
      }
    })
    .catch(error => {
      console.error('Error accessing camera: ', error);
    });
}
  openModal() {
   this.modalFoto.show(); 
 }

 capturarFoto(){
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.showVideo = true;
        const videoElement = document.createElement('video');
        videoElement.srcObject = stream;
        videoElement.play()
          .then(() => {
            const canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            const context = canvas.getContext('2d');

            if (context) {
              context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
              const imageDataURL = canvas.toDataURL('image/png');

              const blob = this.dataURLtoBlob(imageDataURL);
              const file = new File([blob], "captured_image.png");

              // Agregar el archivo al dropzone
              this.zone.run(() => {
                this.capturarImagen.emit(file);
              });
              
              this.closeModal()
            } else {
              console.error('No se pudo obtener el contexto 2D del canvas.');
            }

            stream.getVideoTracks()[0].stop();
            this.showVideo = false;
          })
          .catch(error => {
            console.error('Error al reproducir el video: ', error);
            this.showVideo = false;
          });
      })
      .catch(error => {
        console.error('Error al acceder a la cámara: ', error);
        this.showVideo = false;
      });
  } else {
    console.error('getUserMedia no está soportado en este navegador.');
  }

 }

// Función para convertir una cadena base64 a un objeto Blob
dataURLtoBlob(dataURL: string): Blob {
  const byteString = atob(dataURL.split(',')[1]);
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

  closeModal() {
   this.modalFoto.hide();
 }
}
