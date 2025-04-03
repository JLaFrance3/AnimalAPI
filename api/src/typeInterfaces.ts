export interface Animal {
    id: number;
    createdByUser: number
    name: string;
    sciName: string;
    description: string[];
    images: string[];
    video: string;
    events: Event[];
}

export interface Event {
    name: string;
    date: string;
    url: string;
}

export interface User {
    id: number;
    hash: string;
    name: string;
}

export interface DecodedToken {
    userId: number; 
    iat: number; 
    exp: number;
}