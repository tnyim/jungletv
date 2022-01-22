/*
 * General utils for managing cookies in Typescript.
 */
export function setCookie(name: string, val: string, expiry: Date, sameSite: "Lax" | "Strict" | "None") {
    const value = val;

    // Set it expire in 7 days
    //date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));

    // Set it
    document.cookie = name+"="+value+"; expires="+expiry.toUTCString()+"; path=/; SameSite=" + sameSite;
}

export function getCookie(name: string): string {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");

    if (parts.length == 2) {
        return parts.pop().split(";").shift();
    }
    return "";
}

export function deleteCookie(name: string) {
    const date = new Date();

    // Set it to expire in -1 days
    date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));

    // Set it
    document.cookie = name+"=; expires="+date.toUTCString()+"; path=/";
}
