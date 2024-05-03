export interface IListaUsuario {
    codigo: string;
    desEstado: string;
    desPerfil: string;
    estado: string;
    nombres: string;
    perfil: string;
}

export interface IListaUsuarioParams {
    codigo: string,
    nombres: string,
    perfil: string,
    descripcionPerfil: string,
    estado: string,
    pagina: number,
    longitud: number
}

export interface IUsuario {
    codigo: string;
    nombres: string;
    perfil: string;

}
