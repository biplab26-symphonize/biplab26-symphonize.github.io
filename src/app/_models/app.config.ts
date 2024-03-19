export class Config {
    url: {
        apiUrl: string;
        chatUrl: string;
        signageUrl: string;
        mediaUrl: string;
        documentsUrl: string;
        globalmediaUrl: string;
        weatherUrl: string;
        defaultAvatar: string;
        defaultCover: string;
        defaultAlbum:string;
        defaultsiteLogo: string;
        defaultsiteTitle: string;
        redirectAfterLogin: string;
    };
    permissions: {
        events: []
    };
    kiosk_user: [];
    subscriber_user: [];
}