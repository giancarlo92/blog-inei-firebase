$(() => {    

    $("#btnRegistroEmail").click(() => {
        const nombres = $('#nombreContactoReg').val();
        const email = $('#emailContactoReg').val();
        const password = $('#passwordReg').val();
        // TODO : LLamar crear cuenta con email
        const auth = new Autenticacion()
        auth.crearCuentaEmailPass(email, password, nombres)
    });

    $("#btnInicioEmail").click(() => {
        const email = $('#emailSesion').val();
        const password = $('#passwordSesion').val();
        // TODO : LLamar auth cuenta con email

        const auth = new Autenticacion()
        auth.authEmailPass(email, password)
    });

    $("#avatar").click(() => {
        // const auth = new Autenticacion
        // auth.cerrarSesion()
        $("#modalEditarPerfil").modal('open')
    })

    $("#authGoogle").click(() => {
        const auth = new Autenticacion()
        auth.authCuentaGoogle()
    });

    $("#authFB").click(() => {
        const auth = new Autenticacion()
        auth.authCuentaFacebook()
    });

    //$("#authTwitter").click(() => //AUTH con Twitter);

    $('#btnRegistrarse').click(() => {
        $('#modalSesion').modal('close');
        $('#modalRegistro').modal('open');
    });

    $('#btnIniciarSesion').click(() => {
        $('#modalRegistro').modal('close');
        $('#modalSesion').modal('open');
    });

});