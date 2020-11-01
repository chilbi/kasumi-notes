import { PCRDB } from '../db';

export interface Img2base64Options {
  src: string;
  type?: 'png' | 'jpeg' | 'webp';
  crossOrigin?: boolean;
}

export interface Img2base64Result {
  dataURL: string;
  image?: HTMLImageElement;
  handleLoad?: () => void;
}

class ImageData {
  readonly db: PCRDB;

  protected awaitTasks: (() => Promise<any>)[] = [];
  protected imageCountReadyTasks: (() => any)[] = [];
  protected processing = false;
  protected imageCountReady = false;
  protected realtimeImageCount = 0;
  protected limit = Infinity;

  constructor(db: PCRDB) {
    this.db = db;
    this.db.transaction('image_data', 'readonly').store.count().then(count => {
      this.realtimeImageCount = count;
      this.imageCountReady = true;
      while (this.imageCountReadyTasks.length > 0) {
        this.imageCountReadyTasks.pop()!();
      }
    });
  }

  protected handleQueueTasks() {
    const task = this.awaitTasks.shift();
    if (task) {
      task().then(() => this.handleQueueTasks());
    } else {
      this.processing = false;
    }
  }

  protected addQueueTasks(task: () => Promise<any>) {
    this.awaitTasks.push(task);
    if (!this.processing) {
      this.processing = true;
      this.handleQueueTasks();
    }
  }

  protected async addImageData(url: string, dataURL: string): Promise<void> {
    const store = this.db.transaction('image_data', 'readwrite').store;
    const data = await store.get(url);
    if (data) return;
    await store.add({
      url,
      data_url: dataURL,
      last_visit: new Date(),
    });
  }

  protected async deleteOldestImageData(): Promise<void> {
    const store = this.db.transaction('image_data', 'readwrite').store;
    const cursor = await store.index('image_data_0_last_visit').openCursor();
    if (cursor) await cursor.delete();
  }

  protected async updateImageLastVisit(url: string): Promise<void> {
    const store = this.db.transaction('image_data', 'readwrite').store;
    const imageData = await store.get(url);
    if (imageData) {
      imageData.last_visit = new Date();
      await store.put(imageData);
    }
  }

  protected img2base64(options: Img2base64Options): Promise<Img2base64Result> {
    return new Promise(resolve => {
      const image = new Image();
      const handleLoad = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        canvas.getContext('2d')!.drawImage(image, 0, 0);
        const dataURL = canvas.toDataURL(`image/${options.type || 'png'}`, 1.0);
        resolve({ image, dataURL, handleLoad });
      };
      image.addEventListener('load', handleLoad, false);
      if (options.crossOrigin) image.crossOrigin = 'anonymous';
      image.src = options.src;
    });
  }

  async getImageDataURL(options: Img2base64Options): Promise<Img2base64Result> {
    const imageData = await this.db.transaction('image_data', 'readonly').store.get(options.src);
    if (imageData) {
      if(this.limit < Infinity) this.addQueueTasks(() => this.updateImageLastVisit(imageData.url));
      return { dataURL: imageData.data_url };
    } else {
      const result = await this.img2base64(options);
      const putDel = () => {
        this.realtimeImageCount += 1;
        this.addQueueTasks(() => this.addImageData(options.src, result.dataURL));
        if (this.realtimeImageCount > this.limit) {
          this.realtimeImageCount -= 1;
          this.addQueueTasks(() => this.deleteOldestImageData());
        }
      };
      if (this.imageCountReady) putDel();
      else this.imageCountReadyTasks.push(putDel);
      return result;
    }
  }
}

export default ImageData;
