export interface LogContent {
    subType?: string;
    identifier?: string;
    selectedResult?: string;
    destinationScreen?: string;
    apiName?: string;
    errorContent?: any | LogExceptionContent;
}

export interface LogExceptionContent {
    message: string;
    name: string;
    error: Error;
}

export interface LogRequest {
    level: string;
    type: string;
    subType?: string;
    date: string;
    accountID: string;
    identifier?: string;
    screen: string;
    destinationScreen?: string;
    apiName?: string;
    errorContent?: string | any | LogExceptionContent;
}
