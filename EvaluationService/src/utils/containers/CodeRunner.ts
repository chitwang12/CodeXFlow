import { commands } from "./commands.util";
import { createNewDockerContainer } from "./createContainer.util";
import { InternalServerError } from "../errors/app.error";

const allowListedLanguage = ["python", "cpp"] as const;

export interface RunCodeOptions {
  code: string;
  language: "python" | "cpp";
  timeout: number;
  imageName: string;
  input: string;
}

export async function runCode(options: RunCodeOptions, traceId?: string | undefined) {
  const { code, language, timeout, imageName, input } = options;

  if (!allowListedLanguage.includes(language)) {
    throw new InternalServerError("Unsupported language");
  }

  const container = await createNewDockerContainer({
    imageName,
    cmdExecutable: commands[language](code, input),
    memoryLimit: 1024 * 1024 * 1024
  }, traceId);

  let isTimeLimitExceeded = false;

  const timer = setTimeout(async () => {
    isTimeLimitExceeded = true;
    try {
      await container.kill();
    } catch {}
  }, timeout);

  await container.start();
  const status = await container.wait();

  if (isTimeLimitExceeded) {
    clearTimeout(timer);
    await container.remove({ force: true });
    return {
      status: "time_limit_exceeded",
      output: ""
    };
  }

  const logs = await container.logs({
    stdout: true,
    stderr: true
  });

  const output = processLogs(logs);

  clearTimeout(timer);
  await container.remove({ force: true });

  return {
    status: status.StatusCode === 0 ? "success" : "failed",
    output
  };
}

function processLogs(logs?: Buffer) {
  return logs
    ?.toString("utf-8")
    .replace(/\x00/g, "")
    .replace(/[\x00-\x09\x0B-\x1F\x7F-\x9F]/g, "")
    .trim() || "";
}
