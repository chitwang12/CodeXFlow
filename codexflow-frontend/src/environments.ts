export class Environment{
    production= false;
    problemServiceUrl = 'http://localhost:3000';
    submissionServiceUrl = 'http://localhost:3000/api/v1/submissions';


    //WebSocket URL for real-time updates
    wsUrl: string = 'ws://localhost:3000/ws';
  static problemServiceUrl: any;
  static submissionServiceUrl: any;
}