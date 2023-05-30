type MethodTypes = "GET" | "POST" | "PUT" | "DELETE";

type UserTypes = {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
}

interface RegisterFormTypes extends UserTypes {
    email: string;
    password: string;
}
interface LoginFormTypes {
    username: string;
    password: string;
}

type FormsNames = "logout" | "add-edit-event" | "search"; 


 interface ModalTypes {
    form: FormsNames;
    title?: string;
    lightDarkMode?:"darkMode" | "lightMode";
    closeButton?: boolean;
    header?: boolean;
    maxWidth?:  "maxWidth500" | 'maxWidth600' | 'maxWidth700' | 'maxWidth800' | 'maxWidth900' | 'fullScreen';
    background?: "bgBlur" | "bgDark" | "bgNone" | "bgClosing";
    border?: string;
    fullScreen?: boolean;
}

type EventTypes ={
    id:number;
    title:string;
    description:string;
    user:number;
    likes: number[];
    timestamp:string;
    update:string;
    time:string;
    image:string;
    location:string;
}

type EventsFiltersTypes = {
    page: number;
    query:string;
}

export type {
    FormsNames,
    EventsFiltersTypes,
    EventTypes,
    MethodTypes,
    ModalTypes,
    UserTypes,
    LoginFormTypes,
    RegisterFormTypes,
}

