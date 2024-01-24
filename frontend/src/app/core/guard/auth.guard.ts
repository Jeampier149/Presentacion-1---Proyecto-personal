import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = () => {

    const isLogin = localStorage.getItem('logIn') ?? '0';

    if(parseInt(isLogin) === 0 ){
        inject(Router).navigate(['login']).then();
        localStorage.clear();
        return true
    }

    let fechaExp: any = localStorage.getItem('fechaExpiracion');
    fechaExp = new Date(fechaExp);
    if(new Date() > fechaExp){ // Redireccionar a Login
        inject(Router).navigate(['login']).then();
        localStorage.clear();
        return true
    }

    return true;
};
