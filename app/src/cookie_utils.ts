/*
 * General utils for managing cookies in Typescript.
 */
export function setCookie(name: string, val: string, expiry: Date, sameSite: "Lax" | "Strict" | "None", secure: boolean) {

    // Set it
    let c = name+"="+encodeURIComponent(val)+"; expires="+expiry.toUTCString()+"; path=/; SameSite=" + sameSite;
    if (secure) {
        c += "; Secure";
    }
    document.cookie = c;
}

export function getCookie(name: string): string {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");

    if (parts.length == 2) {
        return decodeURIComponent(parts.pop().split(";").shift());
    }
    return "";
}

export function deleteCookie(name: string) {
    const date = new Date();
    date.setTime(0);

    // Set it
    document.cookie = name+"=; expires="+date.toUTCString()+"; path=/";
}
