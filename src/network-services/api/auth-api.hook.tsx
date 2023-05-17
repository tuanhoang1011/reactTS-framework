import { map } from 'rxjs';

import { APIName, APIRoutes } from '../../core/constants/api-routes';
import useHttpBase from '../../core/hooks/http-base.hook';
import { RefreshTokenResponse, SignInRequest, SignInResponse, UserProfileResponse } from '../../core/models/auth.model';

const useAuthAPI = () => {
    const httpBaseHook = useHttpBase();

    const signIn = (model: SignInRequest) => {
        const reqModel = {
            Username: model.username,
            Password: model.password
        };

        return httpBaseHook.post(httpBaseHook.getURL(APIRoutes.SignIn), APIName.SignInPOST, reqModel).pipe(
            map((res: any) => {
                const resModel: SignInResponse = {
                    expiresIn: res.ExpiresIn,
                    idToken: res.IdToken,
                    refreshToken: res.RefreshToken,
                    passwordExpireDate: res.PasswordExpireDate
                };

                return resModel;
            })
        );
    };

    const signOut = () => {
        return httpBaseHook.put(httpBaseHook.getURL(APIRoutes.SignOut), APIName.SignOutPUT);
    };

    const getUserProfile = () => {
        return httpBaseHook.get(httpBaseHook.getURL(APIRoutes.Profile), APIName.ProfileGET).pipe(
            map((res: any) => {
                const resModel: UserProfileResponse = {
                    userId: res.UserId,
                    permissions: res.Permissions,
                    isAgreeLicense: res.IsAgreeLicense,
                    profile: res.Profile
                };

                return resModel;
            })
        );
    };

    const refreshToken = (refreshToken: string) => {
        return httpBaseHook
            .post(httpBaseHook.getURL(APIRoutes.RefreshToken), APIName.RefreshTokenPOST, {
                refreshToken
            })
            .pipe(
                map((res: any) => {
                    const resModel: RefreshTokenResponse = {
                        expiresIn: res.ExpiresIn,
                        idToken: res.IdToken,
                        refreshToken: res.RefreshToken
                    };

                    return resModel;
                })
            );
    };

    return {
        signIn,
        signOut,
        getUserProfile,
        refreshToken
    };
};

export default useAuthAPI;
