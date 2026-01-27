import { LANGUAGE_CONFIG } from '../config/language.config';
import logger from '../config/logger.config';
import { EvaluationResult, TestCase } from '../interfaces/evaluation.interface';
import { runCode } from '../utils/containers/CodeRunner';
import { SupportedLanguage } from '../interfaces/language';
import { InternalServerError } from '../utils/errors/app.error';

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

export class EvaluationWorker {

  static async handle(data: EvaluationPayload, traceId?: string) {
    try {
        logger.info(`Processing Evaluation | traceId=${traceId} submissionId=${data.submissionId}`);
        const testCasesRunnerPromise = data.problem.testcases.map(testCase =>
          runCode({
            code: data.code,
            language: data.language,
            timeout: LANGUAGE_CONFIG[data.language].timeout,
            imageName: LANGUAGE_CONFIG[data.language].imageName,
            input: testCase.input
          })
        );
    
        const results: EvaluationResult[] = await Promise.all(testCasesRunnerPromise);
        const output = EvaluationWorker.matchTestCasesWithResults(
          data.problem.testcases,
          results
        );
    
        logger.info(`Evaluation completed | traceId=${traceId} submissionId=${data.submissionId}`);
        return output;
      }  catch (error: any) {
        logger.error(`Evaluation Worker failed | traceId=${traceId} submissionId=${data.submissionId} ` + `error=${error?.message}`);
        logger.error(error?.stack);
        throw new InternalServerError('Evaluation Worker failed to process the submission.');
    }
}


static matchTestCasesWithResults(testcases:TestCase[],results:EvaluationResult[]){
    
    const output:Record<string,string> = {};
    if(results.length !== testcases.length){
        console.log("WA");
        return;
    }

    testcases.map((testcase,index)=>{
        let val= "";
        if(results[index].status ==="time_limit_exceeded"){
           val="TLE";
        }
        else if(results[index].status === "failed"){
            val="Error";
        }else{
            if(results[index].output === testcase.output){
                val="AC";
            }
            else{
                val="WA";
            }
        }

        console.log("value of testcases",val);
        output[testcase._id] = val;
    });
    return output;
}
}
