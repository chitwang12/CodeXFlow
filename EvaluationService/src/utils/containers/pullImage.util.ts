import Docker from "dockerode";
import { CPP_IMAGE, PYTHON_IMAGE } from "../constants";
import logger from "../../config/logger.config";

export async function pullImage(image: string) {
  const docker = new Docker();

  return new Promise((res, rej) => {
    docker.pull(image, (err:Error, stream:NodeJS.ReadableStream) => {
      if (err) {
        rej(err);
        return;
      } 

      docker.modem.followProgress(
        stream,
        function onFinished(finalErr, output) {
          if (finalErr) return rej(finalErr);

          res(output);
        },
        function onProgress(event){
            console.log(event.status);
        }
      );
    });
  });
}


export async function pullALLImages() {
    const images = [PYTHON_IMAGE,CPP_IMAGE];
    //paralley start pull both images


    const promises = images.map(img=>pullImage(img));

    try {
        await Promise.all(promises);
        logger.info("All images pulled successfully");
    } catch (error) {
        logger.error("Error pulling images",error);
    }
}

