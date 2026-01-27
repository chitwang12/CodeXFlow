import { BadRequestError } from "../errors/app.error";
import { createNewDockerContainer } from "./createContainer.util";
import { commands } from "./commands.util";
import { SupportedLanguage } from "../../interfaces/language";
import logger from "../../config/logger.config";
import { Container } from "dockerode";

const allowListedLanguage: SupportedLanguage[] = ["python", "cpp"];

export interface IRunCodeOptions {
  code: string;
  language: SupportedLanguage;
  timeout: number;
  imageName: string;
  input?: string;
}

export async function runCode(options: IRunCodeOptions) {
  const { code, language, timeout, imageName, input } = options;

  if (!allowListedLanguage.includes(language)) {
    throw new BadRequestError(`Language ${language} is not supported.`);
  }

  let container: Container | null;

  /** 1️⃣ Create container safely */
  try {
    container = await createNewDockerContainer({
      imageName,
      cmdExecutable: commands[language](code, input || ""),
      memoryLimit: 1024 * 1024 * 1024 // 1GB
    });
  } catch (err) {
    logger.error("Failed to create docker container", err);
    return {
      status: "failed",
      output: "System Error: container creation failed"
    };
  }

  let isTimeLimitExceeded = false;

  /** 2️⃣ Kill container on timeout */
  const timeoutHandle = setTimeout(async () => {
    try {
      isTimeLimitExceeded = true;
      await container?.kill();
    } catch (_) {}
  }, timeout);

  try {
    await container?.start();
    const status = await container?.wait();

    if (isTimeLimitExceeded) {
      await container?.remove({ force: true });
      return {
        status: "time_limit_exceeded",
        output: "Time Limit Exceeded"
      };
    }

    if (!status || typeof status.StatusCode !== "number") {
      await container?.remove({ force: true });
      return {
        status: "failed",
        output: "System Error: invalid container status"
      };
    }

    const logs = await container?.logs({
      stdout: true,
      stderr: true
    });

    const output = processLogs(logs);

    await container?.remove({ force: true });
    clearTimeout(timeoutHandle);

    if (status.StatusCode === 0) {
      return { status: "success", output };
    }

    return { status: "failed", output };

  } catch (err) {
    logger.error("Container execution failed", err);

    try {
      await container?.remove({ force: true });
    } catch (_) {}

    clearTimeout(timeoutHandle);

    return {
      status: "failed",
      output: "System Error: container execution failed"
    };
  }
}

function processLogs(logs: any): string {
  return logs
    ?.toString("utf8")
    .replace(/\x00/g, "")
    .replace(/[\x00-\x09\x0B-\x1F\x7F-\x9F]/g, "")
    .trim();
}
