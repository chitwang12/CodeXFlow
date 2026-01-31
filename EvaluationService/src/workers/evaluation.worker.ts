import { LANGUAGE_CONFIG } from "../config/language.config";
import logger from "../config/logger.config";
import { EvaluationResult, TestCase } from "../interfaces/evaluation.interface";
import { runCode } from "../utils/containers/CodeRunner";
import { SupportedLanguage } from "../interfaces/language";
import { InternalServerError } from "../utils/errors/app.error";

interface EvaluationPayload {
  submissionId: string;
  code: string;
  language: SupportedLanguage;
  problem: {
    testcases: Array<{
      _id: string;
      input: string;
      output: string;
    }>;
  };
}

type SubmissionStatus = "completed" | "attempted" | "failed";

export class EvaluationWorker {
  static async handle(data: EvaluationPayload, traceId?: string) {
    try {
      logger.info(
        `Processing Evaluation | traceId=${traceId} submissionId=${data.submissionId}`
      );
      const testCasesRunnerPromise = data.problem.testcases.map((testCase) =>
        runCode({
          code: data.code,
          language: data.language,
          timeout: LANGUAGE_CONFIG[data.language].timeout,
          imageName: LANGUAGE_CONFIG[data.language].imageName,
          input: testCase.input,
        }, traceId)
      );

      const results: EvaluationResult[] = await Promise.all(
        testCasesRunnerPromise
      );

      const testcaseResults = EvaluationWorker.matchTestCasesWithResults(
        data.problem.testcases,
        results,
        traceId
      );
      const submissionStatus =
        EvaluationWorker.deriveSubmissionStatus(testcaseResults);

      logger.info(
        `Evaluation completed | traceId=${traceId} submissionId=${data.submissionId}`
      );

      return {
        submissionId: data.submissionId,
        traceId,
        submissionStatus,
        testcaseResults,
      };
    } catch (error: any) {
      logger.error(
        `Evaluation Worker failed | traceId=${traceId} submissionId=${data.submissionId} error=${error?.message}`
      );
      logger.error(error?.stack);
      throw new InternalServerError(
        "Evaluation Worker failed to process the submission."
      );
    }
  }

  static matchTestCasesWithResults(testcases: TestCase[], results: EvaluationResult[], traceId?:string|undefined): Record<string, string> {
    if (results.length !== testcases.length) {
      throw new Error(
        `Testcase count mismatch: expected=${testcases.length}, got=${results.length}`
      );
    }

    const output: Record<string, string> = {};

    testcases.forEach((testcase, index) => {
      let val: string;

      const actual = EvaluationWorker.normalize(results[index].output);
      const expected = EvaluationWorker.normalize(testcase.output);

      logger.info("Testcase comparison for traceId", {
        traceId,
        testcaseId: testcase._id,
        input: JSON.stringify(testcase.input),
        expected: JSON.stringify(expected),
        actual: JSON.stringify(actual),
      });

      if (results[index].status === "time_limit_exceeded") {
        val = "TLE";
      } else if (results[index].status === "failed") {
        val = "Error";
      } else {
        val = actual === expected ? "AC" : "WA";
      }

      output[testcase._id] = val;
    });

    return output;
  }

  static deriveSubmissionStatus(
    testcaseResults: Record<string, string>
  ): SubmissionStatus {
    const values = Object.values(testcaseResults);

    const allAccepted = values.every((v) => v === "AC");
    const someAccepted = values.some((v) => v === "AC");

    if (allAccepted) return "completed";
    if (someAccepted) return "attempted";
    return "failed";
  }

  static normalize(str?: string): string {
    if (!str) return "";
    return str
      .replace(/\r\n/g, "\n") // Windows → Unix
      .replace(/\s+/g, " ") // collapse spaces/newlines
      .trim(); // remove leading/trailing space
  }
}
