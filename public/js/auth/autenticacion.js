class Autenticacion {
  authEmailPass (email, password) {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password) //loguea
      .then(result => {
        // Preguntar si confirmo el correo 
        if(result.user.emailVerified){
          $('#avatar').attr('src', 'imagenes/usuario_auth.png')
          Materialize.toast(`Bienvenido ${result.user.displayName}`, 5000) // 5s
        } else {
          firebase.auth().signOut()
          Materialize.toast(`Por favor realiza la verificación de la cuenta`, 5000) // 5s
        }
      })

    $('.modal').modal('close')
   
  }

  crearCuentaEmailPass (email, password, nombres) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(result => {
        result.user.updateProfile({
          displayName: nombres
        })

        const configuration = {
          url: "http://localhost:5500/public/"
        }

        // Envio de correo de verificacion
        result
          .user
          .sendEmailVerification(configuration)
          .catch(error => {
            console.log(error)
            Materialize.toast(error.message, 4000) // 4s
          })

         // Hacer logout al usuario hasta que verifique su correo
         firebase.auth().signOut()

         // Mensaje de bienvenida 
         Materialize.toast(`Bienvenido(a) ${nombres}, debes realizar el proceso de verificación `, 4000)

         $('.modal').modal('close')
      })
      .catch(error => {
        console.log(error)
        Materialize.toast(error.message,
          4000
        )
      })
    
  }

  cerrarSesion(){
    firebase
      .auth()
      .signOut()
      .then(() => {
        $('#avatar').attr('src', 'imagenes/usuario.png')
        Materialize.toast(`Se cerró la sesión correctamente`, 5000) // 5s
      })
      .catch(error => {
        Materialize.toast(`Error al cerrar la sesión ${error.message}`, 4000)
      })
  }

  authCuentaGoogle () {
    const provider = new firebase.auth.GoogleAuthProvider()
    // este es la mejor de loguearse con google para que la aplicacion no redirija a otra pagina
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        $('#avatar').attr('src', result.user.photoURL)
        $('.modal').modal('close')
        Materialize.toast(`Bienvenido ${result.user.displayName} !! `, 4000)
      })
      .catch(error => {
        console.log(error);
        Materialize.toast(`Error al autenticarse con Google ${error.message}`, 4000)
      })
  }

  authCuentaFacebook () {
    const provider = new firebase.auth.FacebookAuthProvider()

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        $('#avatar').attr('src', result.user.photoURL)
        $('.modal').modal('close')
        Materialize.toast(`Bienvenido ${result.user.displayName} !! `, 4000)
      })
      .catch(error => {
        console.log(error);
        Materialize.toast(`Error al autenticarse con Facebook ${error.message}`, 4000)
      })
  }

  authTwitter () {
    // TODO: Crear auth con twitter
  }
}
