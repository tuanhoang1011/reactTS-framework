export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    expiresIn?: string;
    idToken?: string;
    refreshToken?: string;
}

export interface SignInRequest {
    username?: string;
    password?: string;
}

export interface SignInResponse {
    expiresIn?: string;
    idToken?: string;
    refreshToken?: string;
    passwordExpireDate?: Date | number;
}

export interface UserProfileResponse {
    userId?: string;
    permissions?: number[];
    isAgreeLicense?: boolean;
    profile?: Profile;
}

export interface Profile {
    fullName?: string;
    birthday?: Date | number;
    gender?: number;
    phoneNumber?: string;
    address?: string;
    mailAddress?: string;
}
