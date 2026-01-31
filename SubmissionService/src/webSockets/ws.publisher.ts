import {clients} from "./ws.server";
import logger  from "../config/logger.config";


export function notifySubmissionUpdate(submissionId: string, message: any){
    logger.info(`Notifying submission update for submissionId: ${submissionId}`, `and message is ${message}`);
    const socket = clients.get(submissionId);
    if(socket && socket.readyState === socket.OPEN){
        socket.send(JSON.stringify(message));
    }
}