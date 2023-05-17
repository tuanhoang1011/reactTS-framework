import { APIName, APIRoutes } from '../../core/constants/api-routes';
import useApolloClient from '../../core/hooks/graphQL-base.hook';
import useHttpBase from '../../core/hooks/http-base.hook';

const useExampleAPI = () => {
    const httpBaseHook = useHttpBase();
    const apolloClientHook = useApolloClient();

    const pushLogs = (logs: any[]) => {
        return httpBaseHook.post<{ Items: any[] }, boolean>(httpBaseHook.getURL(APIRoutes.Log), APIName.LogPOST, {
            Items: logs
        });
    };

    const createCommentSubscription = (userID: string) => {
        const statement = `subscription CreateComment($userID: String) {
            createComment(UserUID: $userID) {
                UserUID
                TopicID
                CommentID
            }
        }`;

        return apolloClientHook.executeStatement<any, any>(statement, 'Subcrice Creating Comment', {
            userID: userID
        });
    };

    const createCommentMutation = async (userID: string, topicID: string) => {
        const statement = `mutation CreateComment($userID: String!, $topicID: String!) {
            createComment(UserUID: $userID, TopicID: $topicID) {
                UserUID
                TopicID
                CommentID
            }
        }`;

        return await apolloClientHook.executeStatement<any, any>(statement, ' Create Comment', {
            userID: userID,
            topicID: topicID
        });
    };

    return { pushLogs, createCommentSubscription, createCommentMutation };
};

export default useExampleAPI;
