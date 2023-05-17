export const APIRoutes = Object.freeze({
    // profile
    SignIn: '/sign-in',
    SignOut: '/sign-out',
    Profile: '/profile',
    RefreshToken: '/refresh-token',

    // Log
    Log: '/logs'
});

export const APIName = Object.freeze({
    LogPOST: 'PushLogFunc',
    SignInPOST: 'SignInFunc',
    SignOutPUT: 'SignOutFunc',
    ProfileGET: 'GetProfileFunc',
    RefreshTokenPOST: 'RefreshTokenFunc'
});
