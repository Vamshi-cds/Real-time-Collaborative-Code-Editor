// created a action which we can dispatch later
export const setuser = (username:string) => {
    return {
        type: 'Login',
        username: username

    };
;}

export const setdocid = (docid:string) => {
    return {
        type: 'Doc',
        docid: docid

    };
;}

export const setdoctitle = (doctitle:string) => {
    return {
        type: 'Title',
        doctitle: doctitle

    };
;}
