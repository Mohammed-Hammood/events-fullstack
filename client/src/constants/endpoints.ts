
const baseURL = `http://127.0.0.1:8000`;

type Props = { 
    min: number, 
    query: string 
}

export const Endpoints = {
    baseURL,
    register: `${baseURL}/api/accounts/register`,
    login: `${baseURL}/api/accounts/login`,
    logout: `${baseURL}/api/accounts/logout`,
    getUser: `${baseURL}/api/accounts/get-user`,
    allEvents: ({ min, query }: Props): string => `${baseURL}/api/events/all-events?min=${min}&query=${query}`,
    likedEvents: ({ min, query }: Props): string => `${baseURL}/api/events/liked-events?min=${min}&query=${query}`,
    myEvents: ({ min, query }: Props): string => `${baseURL}/api/events/my-events?min=${min}&query=${query}`,
    likesToggle: (event_id: number): string => `${baseURL}/api/events/likes-toggle/${event_id}`,
}

