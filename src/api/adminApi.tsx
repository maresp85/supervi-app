import cafeApi from "./cafeApi";

import Moment from 'moment';
import 'moment/locale/es-do';
Moment.locale('es-do');


export const getOrder = async(usuario: any, bitacora: any) => {
    return await cafeApi.get(`/ordentrabajo/listarusuario-obra/${ usuario }/${ bitacora }`);
};

export const getHermeticidad = async(usuario: any) => {
    return await cafeApi.get(`/hermeticidad/listarusuario-obra/${ usuario }`);
};

export const getOneWorkOrder = async(ordenTrabajoId: any) => {
    return await cafeApi.get(`/ordentrabajo/listaruna/${ ordenTrabajoId }`);
};


export const updateExtraFields = async(_id: any, extraFieldsData: any) => {

    const myObj = {
        'extraFieldsData': extraFieldsData
    };    

    const params = JSON.stringify(myObj);
  
    return await cafeApi.put(`/ordentrabajo/extraFields/${_id}`, params, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export const getOrderTipoTrabajo = async(ordenTipoTrabajo: any) => {
    
    return await cafeApi.get(`/ordentipotrabajo/listar/${ ordenTipoTrabajo }`);
};

export const getTrabajo = async(empresa: any) => {     
 
    return await cafeApi.get(`/trabajo/listar-no-bitacora/${ empresa }`);
}

export const getObraUsuario = async(usuario: any) => {     
 
    return await cafeApi.get(`/obra/listar-usuario/${ usuario }`);
}

export const getLecturaHermeticidad = async(hermeticidad: any) => {     
 
    return await cafeApi.get(`/hermeticidadlectura/listar/${ hermeticidad }`);
}

export const postOrden = async(
    empresa: any, 
    trabajo: any, 
    obra: any,
    usuario: any,
    observaciones: any,
) => {
    let fecha = Date.now();

    return await cafeApi.post('/ordentrabajo/crear', {
        empresa: empresa,
        trabajo: trabajo,
        obra: obra,
        usuario: usuario,
        fecha: fecha,
        observaciones: observaciones,
    }, { timeout: 5000 });
};

export const postHermeticidad = async(
    empresa: any,  
    obra: any,
    usuario: any,
) => {
    let fecha = Date.now();

    return await cafeApi.post('/hermeticidad/crear', {
        empresa: empresa,
        obra: obra,
        usuario: usuario,
        fecha: fecha,
    }, { timeout: 5000 });
};

export const getOrderActividad = async(ordenTipoTrabajo: any) => {
    
    return await cafeApi.get(
        `/ordenactividad/listarunaordentipotrabajo/${ ordenTipoTrabajo }`
    );
};

export const getOrderActividadBitacora = async(ordenTipoTrabajo: any, role: any) => {
    
    return await cafeApi.get(
        `/ordenactividad/listarunaordentipotrabajo-usuario/${ ordenTipoTrabajo }/${ role }`
    );
};

export const deleteOrderActividad = async(ordenTipoTrabajo: any) => {
    
    return await cafeApi.delete(`/ordenactividad/eliminar/${ ordenTipoTrabajo }`);
};

// Listar legalizacion

export const getItemActividad = async(actividad: any, cumple: any) => {
    
    return await cafeApi.get(`/itemactividad/listarcumple/${ actividad }/${ cumple }`);
};

export const getImgOrdenActividad = async(actividad: any) => {
    
    return await cafeApi.get(`/imgordenactividad/listar/${ actividad }`);
};

export const getOrdenActividad = async(_id: any) => {
    
    return await cafeApi.get(`/ordenactividad/listaruna/${ _id }`);
};

export const getCheckOrdenActividad = async(actividad: any) => {
    
    return await cafeApi.get(`/checkordenactividad/listar/${ actividad }`);
};

// ===================================================
// Actualiza estado orden actividad
// ===================================================
export const putEstadoOrdenActividad = async(
    actividad: any, 
    estado: any,
    usuario: any,
    observacion: any,
    fechaMejora: any,
    checkList: any,
    image1: any,
    image2: any,
) => {

    (estado == 1) ? estado = 'CUMPLE' : estado = 'NO CUMPLE';
    let fechaLegaliza: any = Date.now();

    const formData: any = new FormData();
    formData.append('estado', estado);
    formData.append('usuariolegaliza', usuario);
    formData.append('fechalegaliza', fechaLegaliza);    
    formData.append('observacion', observacion);
    formData.append('fechaMejora', fechaMejora);
    formData.append('checklist', JSON.stringify(checkList));

    let localUri;
    let filename: any;
    let match: any;
    let type: any;

    if (image1) {
        localUri = image1.uri;
        filename = 'EVIDENCIAS=' + localUri.split('/').pop();
        match = /\.(\w+)$/.exec(filename);
        type = match ? `image/${match[1]}` : 'image';
        formData.append('uploads[]', { uri: localUri, name: filename, type });
    }

    if (image2) {
        localUri = image2.uri;
        filename = 'EVIDENCIAS=' + localUri.split('/').pop();
        match = /\.(\w+)$/.exec(filename);
        type = match ? `image/${match[1]}` : 'image';
        formData.append('uploads[]', { uri: localUri, name: filename, type });
    }   

    return await cafeApi.put(`/ordenactividad/editar/${ actividad }`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        timeout: 5000
    });
}

// ===================================================
// Actualiza bitácora
// ===================================================
export const actualizaNota = async(
    actividad: any, 
    estado: any,
    usuario: any,
    observacion: any,
    fechaMejora: any,
    checkList: any,
    image1: any,
    image2: any,
    image3: any,
    image4: any,
) => {

    (estado == 1) ? estado = 'CUMPLE' : estado = 'NO CUMPLE';
    let fechaLegaliza: any = Date.now();

    const formData: any = new FormData();
    formData.append('estado', estado);
    formData.append('usuariolegaliza', usuario);
    formData.append('fechalegaliza', fechaLegaliza);    
    formData.append('observacion', observacion);
    formData.append('fechaMejora', fechaMejora);
    formData.append('checklist', JSON.stringify(checkList));

    let localUri;
    let filename: any;
    let match: any;
    let type: any;

    if (image1) {
        localUri = image1.uri;
        filename = 'EVIDENCIAS=' + localUri.split('/').pop();
        match = /\.(\w+)$/.exec(filename);
        type = match ? `image/${match[1]}` : 'image';
        formData.append('uploads[]', { uri: localUri, name: filename, type });
    }

    if (image2) {
        localUri = image2.uri;
        filename = 'EVIDENCIAS=' + localUri.split('/').pop();
        match = /\.(\w+)$/.exec(filename);
        type = match ? `image/${match[1]}` : 'image';
        formData.append('uploads[]', { uri: localUri, name: filename, type });
    }

    if (image3) {
        localUri = image3.uri;
        filename = 'EVIDENCIAS=' + localUri.split('/').pop();
        match = /\.(\w+)$/.exec(filename);
        type = match ? `image/${match[1]}` : 'image';
        formData.append('uploads[]', { uri: localUri, name: filename, type });
    } 

    if (image4) {
        localUri = image4.uri;
        filename = 'EVIDENCIAS=' + localUri.split('/').pop();
        match = /\.(\w+)$/.exec(filename);
        type = match ? `image/${match[1]}` : 'image';
        formData.append('uploads[]', { uri: localUri, name: filename, type });
    }

    return await cafeApi.put(`/ordenactividad-bitacora/editar/${ actividad }`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        timeout: 5000
    });
}

export const putInactivaOrdenActividad = async(ordenActividad: any) => {
 
    return await cafeApi.put(`/ordenactividad/inactivar/${ ordenActividad }`, {
        activo: 0, 
    });
}

// ===================================================
// Crear lectura
// ===================================================
export const postLectura = async(
    hermeticidad: any, 
    ubicacion: any,
    lecturaInicial: any,
    realizo: any,
    observaciones: any,
    image1: any,
) => {

    let fechaInicial: any = Date.now();
    const formData: any = new FormData();
    formData.append('hermeticidad', hermeticidad);
    formData.append('ubicacion', ubicacion);
    formData.append('lecturainicial', lecturaInicial);    
    formData.append('fechainicial', fechaInicial);    
    formData.append('realizo', realizo);    
    formData.append('observaciones', observaciones);

    let localUri;
    let filename: any;
    let match: any;
    let type: any;

    if (image1) {
        localUri = image1.uri;
        filename = 'EVIDENCIAS=' + localUri.split('/').pop();
        match = /\.(\w+)$/.exec(filename);
        type = match ? `image/${match[1]}` : 'image';
        formData.append('file', { uri: localUri, name: filename, type }); 
        formData.append('imageninicial', filename); 
    }

    return await cafeApi.post(`/hermeticidadlectura/crear`, formData, {    
        timeout: 5000
    });
}

export const putLectura = async(
    lectura: any,
    lecturaFinal: any,
    image1: any,
) => {

    let fechaFinal: any = Date.now();
    const formData: any = new FormData();
    formData.append('lecturafinal', lecturaFinal);    
    formData.append('fechafinal', fechaFinal);    
    formData.append('finalizada', true);

    let localUri;
    let filename: any;
    let match: any;
    let type: any;

    if (image1) {
        localUri = image1.uri;
        filename = 'EVIDENCIAS=' + localUri.split('/').pop();
        match = /\.(\w+)$/.exec(filename);
        type = match ? `image/${match[1]}` : 'image';
        formData.append('file', { uri: localUri, name: filename, type }); 
        formData.append('imagenfinal', filename); 
    }

    return await cafeApi.put(`/hermeticidadlectura/actualizar/${ lectura }`, formData, {    
        timeout: 5000
    });
}

// ===================================================
// Búsqueda ordenes de trabajo
// ===================================================
export const buscarOrdenes = async(
    empresa: any, 
    id: any,
    usuario: any, 
    estado: any,
    idviga: any,
    trabajo: any,
    obra: any,
    fecha: any,
) => {
    return await cafeApi.post('/ordentrabajo/buscar/', {
        empresa: empresa, 
        id: id, 
        usuario: usuario,
        estado: estado,
        idviga: idviga,
        trabajo: trabajo,
        obra: obra,
        fecha: fecha,
        fechaf: fecha,
    });
}

export const getNotasBitacora = async(ordenTrabajo: any) => {
    
    return await cafeApi.get(`/ordenactividad/listartodas-bitacoras/${ ordenTrabajo }`);
};

export const getActividadesRole= async(trabajo: any, role: any) => {
    
    return await cafeApi.get(`/actividad/listartrabajo-role/${ trabajo }/${ role }`);
};

export const createNoteActividad = async(
    ordenTrabajo: any,
    actividad: any,
    empresa: any,
    role: any,
) => {
    let fecha = Date.now();

    return await cafeApi.post('/ordenactividad-nota/crear', {
        ordentrabajo: ordenTrabajo,
        actividad: actividad,
        empresa: empresa,
        fecha: fecha,
        role: role,
    }, { timeout: 5000 });
};

// ===================================================
// Actualiza estado orden actividad
// ===================================================
export const postDigitalSignature = async(
    ordenTrabajo: any,
    signatureImage: any,
) => {

    const formData: any = new FormData();
    formData.append('signatureImage', signatureImage);

    return await cafeApi.put(`/signature-order/${ordenTrabajo}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        timeout: 5000
    });
}