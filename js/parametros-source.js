"use strict";

const PARAMETROS_CONFIG =
{
    visorUrl:
        "https://kiris25.github.io/parametros-emisor/",

    dataBaseUrl:
        "https://kiris25.github.io/parametros-emisor/data/externo/",

    cacheVersion:
        "fase-1"
};

function construirRutaOpcion(numeroOpcion)
{
    const codigo = String(numeroOpcion).padStart(2, "0");

    return `${PARAMETROS_CONFIG.dataBaseUrl}op${codigo}.json`;
}

async function cargarParametrosOpcion(numeroOpcion)
{
    const ruta = construirRutaOpcion(numeroOpcion);

    const separador = ruta.includes("?") ? "&" : "?";

    const respuesta = await fetch(
        `${ruta}${separador}v=${Date.now()}`,
        {
            cache: "no-store"
        }
    );

    if (!respuesta.ok)
    {
        throw new Error(
            `No fue posible cargar la opción ${numeroOpcion}. ` +
            `Respuesta HTTP: ${respuesta.status}.`
        );
    }

    const contenido = await respuesta.json();

    if (!Array.isArray(contenido))
    {
        throw new Error(
            `El archivo de la opción ${numeroOpcion} no contiene una lista válida.`
        );
    }

    return contenido;
}

function obtenerTextoPlano(valor)
{
    const temporal = document.createElement("div");

    temporal.innerHTML = String(valor ?? "");

    return temporal.textContent.trim();
}

function obtenerCampo(registro, nombres, valorPredeterminado = "")
{
    for (const nombre of nombres)
    {
        const valor = registro?.[nombre];

        if (
            valor !== undefined &&
            valor !== null &&
            String(valor).trim() !== ""
        )
        {
            return obtenerTextoPlano(valor);
        }
    }

    return valorPredeterminado;
}

function normalizarListaValores(valor)
{
    if (Array.isArray(valor))
    {
        return valor
            .map(
                function(elemento)
                {
                    if (typeof elemento === "string")
                    {
                        return elemento.trim();
                    }

                    return obtenerCampo(
                        elemento,
                        [
                            "valor",
                            "codigo",
                            "nombre",
                            "descripcion",
                            "label"
                        ]
                    );
                }
            )
            .filter(Boolean);
    }

    const texto = obtenerTextoPlano(valor);

    if (!texto)
    {
        return [];
    }

    return texto
        .split(/\r?\n|;|\|/)
        .map(
            function(elemento)
            {
                return elemento.trim();
            }
        )
        .filter(Boolean);
}

function adaptarParametro(registro, indice, numeroOpcion)
{
    const valoresOriginales =
        registro?.valoresPermitidos ??
        registro?.valores ??
        registro?.opciones ??
        registro?.allowedValues ??
        "";

    const valoresPermitidos =
        normalizarListaValores(valoresOriginales);

    const automatico = obtenerCampo(
        registro,
        [
            "automatico",
            "valorAutomatico",
            "systemGenerated"
        ]
    );

    const noAplica = obtenerCampo(
        registro,
        [
            "noAplica",
            "notApplicable"
        ]
    );

    return {
        id:
            obtenerCampo(
                registro,
                [
                    "id",
                    "numero",
                    "codigo",
                    "orden"
                ],
                String(indice + 1)
            ),

        nombre:
            obtenerCampo(
                registro,
                [
                    "nombre",
                    "parametro",
                    "titulo",
                    "name"
                ],
                `Parámetro ${indice + 1}`
            ),

        producto:
            obtenerCampo(
                registro,
                [
                    "producto",
                    "product"
                ]
            ),

        pais:
            obtenerCampo(
                registro,
                [
                    "pais",
                    "country"
                ]
            ),

        descripcion:
            obtenerCampo(
                registro,
                [
                    "que",
                    "descripcion",
                    "detalle",
                    "description"
                ],
                "La ficha no incluye una descripción visible."
            ),

        funcionamiento:
            obtenerCampo(
                registro,
                [
                    "como",
                    "funcionamiento",
                    "how"
                ]
            ),

        dependencias:
            obtenerCampo(
                registro,
                [
                    "dependencias",
                    "reglas",
                    "dependencies"
                ]
            ),

        notas:
            obtenerCampo(
                registro,
                [
                    "notas",
                    "observaciones",
                    "notes"
                ]
            ),

        valoresPermitidos:
            valoresPermitidos,

        automatico:
            /^(s|si|sí|true|1)$/i.test(automatico),

        noAplica:
            /^(s|si|sí|true|1)$/i.test(noAplica),

        opcion:
            numeroOpcion,

        registroOriginal:
            registro
    };
}

async function obtenerOpcionFormulario(numeroOpcion)
{
    const registros = await cargarParametrosOpcion(numeroOpcion);

    return registros.map(
        function(registro, indice)
        {
            return adaptarParametro(
                registro,
                indice,
                numeroOpcion
            );
        }
    );
}

function construirUrlFicha(parametro)
{
    const parametros = new URLSearchParams(
        {
            modo:
                "ficha",

            opcion:
                String(parametro.opcion).padStart(2, "0"),

            parametro:
                parametro.id,

            nombre:
                parametro.nombre
        }
    );

    return `${PARAMETROS_CONFIG.visorUrl}?${parametros.toString()}`;
}

window.ParametrosSource =
{
    config:
        PARAMETROS_CONFIG,

    cargarOpcion:
        obtenerOpcionFormulario,

    construirUrlFicha:
        construirUrlFicha
};
