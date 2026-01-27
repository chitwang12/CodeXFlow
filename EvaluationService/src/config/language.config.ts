import{ CPP_IMAGE, JAVA_IMAGE, PYTHON_IMAGE } from "../utils/constants";

export const LANGUAGE_CONFIG = {
    python:{
        timeout: 5000,
        imageName: PYTHON_IMAGE
    },
    cpp: {
        timeout: 3000,
        imageName: CPP_IMAGE
    },
    java: {
        timeout: 4000,
        imageName: JAVA_IMAGE
    }
}