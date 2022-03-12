$(() => {
  $('.tooltipped').tooltip({ delay: 50 })
  $('.modal').modal()

  // TODO: Adicionar el service worker

  // Init Firebase nuevamente
  firebase.initializeApp(varConfig);

  // TODO: Registrar LLave publica de messaging

  // TODO: Solicitar permisos para las notificaciones

  // TODO: Recibir las notificaciones cuando el usuario esta foreground

  // TODO: Recibir las notificaciones cuando el usuario esta background

  // TODO: Listening real time

  // TODO: Firebase observador del cambio de estado
  firebase
    .auth()
    // pregunta si la sesión ha cambiado (si esta logueado o no)
    .onAuthStateChanged(user => {
      if(user){
        $('#btnInicioSesion').text('Salir')
        // error que sucede cuando se loguea, a veces no trae foto.
        if(user.photoURL){
          $('#avatar').attr('src', user.photoURL)
        } else{
          $('#avatar').attr('src', 'imagenes/usuario_auth.png')
        }
      } else {
        $('#btnInicioSesion').text('Iniciar Sesión')
        $('#avatar').attr('src', 'imagenes/usuario.png')
      }
  })

  // TODO: Evento boton inicio sesion
  $('#btnInicioSesion').click(() => { 
    const user = firebase.auth().currentUser // obtiene el usuario logueado
    if(user){
      $('#btnInicioSesion').text("Iniciar sesión")
      return firebase
              .auth()
              .signOut()
              .then(() => {
                $('#avatar').attr('src', 'imagenes/usuario.png')
                Materialize.toast(`Se cerró la sesión correctamente`, 4000)
              })
              .catch(error => {
                Materialize.toast(`Error al realizar SignOut => ${error.message}`, 4000)
              })
    }

    $('#emailSesion').val('')
    $('#passwordSesion').val('')
    $('#modalSesion').modal('open')
  })

  $('#avatar').click(() => {
    //$('#avatar').attr('src', 'imagenes/usuario.png')
    //Materialize.toast(`SignOut correcto`, 4000)
  })

  $('#btnTodoPost').click(() => {
    $('#tituloPost').text('Posts de la Comunidad')   
  })

  $('#btnMisPost').click(() => {
    //$('#tituloPost').text('Mis Posts')
    //Materialize.toast(`Debes estar autenticado para ver tus posts`, 4000)    
  })
})
