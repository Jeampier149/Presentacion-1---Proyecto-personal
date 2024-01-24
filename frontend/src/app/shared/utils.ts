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
