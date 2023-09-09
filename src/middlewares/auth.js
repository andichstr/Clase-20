export const getUserFromSession = (req) => {
    return req?.session?.passport?.user;
}

export function checkUser(req, res, next) {
    const user = getUserFromSession(req);
    if (!!user && user.role=="user") {
        return next();
    }
    return res.status(401).render('errorPage', { msg: 'Please log in' });
}

export function checkAdmin(req, res, next) {
    const user = getUserFromSession(req);
    if (!!user && user.role == "admin") {
        return next();
    }
    return res.status(401).render('errorPage', { msg: 'No tenes acceso a esta vista. Solo para administradores' });
}