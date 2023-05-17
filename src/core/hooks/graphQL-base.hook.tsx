import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { createHttpLink } from 'apollo-link-http';
import { AUTH_TYPE, AuthOptions, createAuthLink } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';

import { LogMessage, LogSubType, LogType } from '../constants/log.const';
import { LogContent } from '../models/log.model';
import useAuth from './auth.hook';
import useLog from './log.hook';

const useApolloClient = () => {
    const logHook = useLog();
    const authHook = useAuth();

    // use apollo client with aws appasync
    const url = process.env['REACT_APP_AWS_APPSYC_ENDPOINT'] ?? '';
    const region = process.env['REACT_APP_AWS_APPSYC_REGION'] ?? '';
    const auth = {
        type: process.env['REACT_APP_AWS_APPSYC_AUTH_TYPE'] ?? AUTH_TYPE.NONE,
        token: authHook.idToken()
    } as AuthOptions;

    // create http
    const httpLink = createHttpLink({ uri: url });

    // general handling  when an error occurs
    const errorLink = onError(({ networkError, operation }) => {
        if (networkError) {
            writeLog(networkError ?? LogMessage.Unknown, (operation.variables as any).functionName);
        }
    });

    const link = ApolloLink.from([
        errorLink,
        createAuthLink({ url, region, auth } as any),
        createSubscriptionHandshakeLink({ url, region, auth } as any, httpLink as any)
    ]);

    const client = new ApolloClient({
        link,
        cache: new InMemoryCache()
    });

    const writeLog = (err: any, functionName: string) => {
        // write log
        logHook.error(LogType.Error, {
            subType: LogSubType.APIError,
            apiName: functionName,
            errorContent:
                err.hasOwnProperty('errors') && err.errors[0].hasOwnProperty('message')
                    ? err.errors[0]
                    : navigator.onLine
                    ? LogMessage.Unknown
                    : LogMessage.NoNetwork
        } as LogContent);
    };

    const executeStatement = <RequestType, ResponseType>(
        statement: string,
        functionName: string,
        model?: RequestType
    ): Observable<ResponseType> => {
        const response = client.subscribe<RequestType, any>({
            query: gql`
                ${statement}
            `,
            variables: { ...model, functionName } as any
        }) as any;

        return response as Observable<ResponseType>;
    };

    return { client, executeStatement };
};

export default useApolloClient;
