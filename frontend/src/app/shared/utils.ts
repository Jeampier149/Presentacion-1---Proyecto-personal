import Swal, {SweetAlertOptions, SweetAlertResult} from "sweetalert2";

export async function errorAlerta(titulo: string, mensaje: string, html?: string, opciones?: SweetAlertOptions) : Promise<SweetAlertResult> {
    return await Swal.fire({
        icon: 'error',
        title: titulo,
        text: mensaje,
        html: html,
        confirmButtonText: 'Cerrar',
        showCloseButton: false,
        ...opciones
    })
}

export async function warningAlerta(titulo: string, mensaje: string, tiempo = 3000, opciones?: SweetAlertOptions): Promise<SweetAlertResult> {
    return await Swal.fire({
        icon: 'warning',
        title: titulo,
        text: mensaje,
        timer: tiempo,
        showCloseButton: false,
        timerProgressBar: true,
        showConfirmButton: false,
        ...opciones
    })
}

export async function successAlerta(titulo: string, mensaje: string, tiempo = 3000) {
    await Swal.fire({
        icon: 'success',
        title: titulo,
        text: mensaje,
        timer: tiempo,
        timerProgressBar: true,
        showConfirmButton: false
    })
}
export async function errorAlertaValidacion(titulo: string, errores: string) {
    await Swal.fire({
        icon: 'error',
        title: titulo,
        html: formatearMensaje(errores),
        confirmButtonText: 'Cerrar',
        showCloseButton: false
    })
}
function formatearMensaje(mensaje: string): string {
    let html = '';

    const errores = typeof mensaje === 'object' ? mensaje : JSON.parse(mensaje);
    for (const error in errores) {
        const campo = errores[error];
        campo.forEach((c: string) => {
            html += `${c}<br>`;
        });
    }

    return html.slice(0, -4);
}
