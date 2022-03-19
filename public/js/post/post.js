class Post {
  constructor () {
      // TODO inicializar firestore y settings
    this.db = firebase.firestore()
  }

  crearPost (uid, emailUser, titulo, descripcion, imagenLink, videoLink) {
    return this.db
            .collection("posts")
            .add({
                //izquierdo (nombre del campo en firestore) : derecho (variable que pasamos como parametro)
                uid,
                correo: emailUser,
                // tanto el nombre del campo en firestore como variable tienen el mismo nombre
                titulo,
                descripcion,
                imagenLink,
                videoLink,
                fecha: firebase.firestore.FieldValue.serverTimestamp() //nos coloca la fecha actual
            })
            .then(refDoc => {
                console.log(`Id del post ${refDoc.id}`);
            })
            .catch(error => {
                console.log(`error creando el post ${error.message}`);
            })
  }

  editarPost (id, uid, emailUser, titulo, descripcion, imagenLink, videoLink) {
    let refPost = this.db.collection("posts").doc(id)

    return refPost.update({
        uid,
        correo: emailUser,
        titulo,
        descripcion,
        imagenLink,
        videoLink,
        fecha: firebase.firestore.FieldValue.serverTimestamp()
    })
    .catch(error => {
        console.log(`error editando el post ${error.message}`);
    })
  }

  consultarTodosPost () {
    this
        .db
        .collection("posts")
        .orderBy("fecha", "asc")
        .orderBy("titulo", "asc")
        // funcion que hace el realtime
        .onSnapshot(querySnapshot => {
            $("#posts").empty()
            //querySnapshot.empty -> pregunta si esta vacio la lista
            if(querySnapshot.empty){
                $("#posts").append(this.obtenerTemplatePostVacio())
            } 
            // si encuentra al menos un registro
            else{
                //forEach: nos sirve para recorrer todos los datos de la lista
                querySnapshot.forEach(post => {
                    let postHtml = this.obtenerPostTemplate(
                        // post.data() == undefined ? null : post.data().correo
                        post.data()?.correo,
                        post.data()?.titulo,
                        post.data()?.descripcion,
                        post.data()?.videoLink,
                        post.data()?.imagenLink,
                        post.data()?.calificacion,
                        Utilidad.obtenerFecha(post.data().fecha?.toDate()), //segundos 42342342342
                        post?.id,
                        false
                    )
                    $("#posts").append(postHtml)
                })
            }
        })
  }

  consultarPostxUsuario (emailUser) {
    this
        .db
        .collection("posts")
        .where("correo", "==", emailUser)
        .orderBy("fecha", "asc")
        .onSnapshot(querySnapshot => {
            $("#posts").empty()
            if(querySnapshot.empty){
                $("#posts").append(this.obtenerTemplatePostVacio())
            } 
            // si encuentra al menos un registro
            else{
                //forEach: nos sirve para recorrer todos los datos de la lista
                querySnapshot.forEach(post => {
                    let postHtml = this.obtenerPostTemplate(
                        post.data()?.correo,
                        post.data()?.titulo,
                        post.data()?.descripcion,
                        post.data()?.videoLink,
                        post.data()?.imagenLink,
                        post.data()?.calificacion,
                        Utilidad.obtenerFecha(post.data().fecha?.toDate()), //segundos 42342342342
                        post?.id,
                        true
                    )
                    $("#posts").append(postHtml)
                })
            }
        })
  }

  colocarPostSeleccionado(post){
    $("#posts").empty()
    let postHtml = this.obtenerPostTemplate(
        post.data()?.correo,
        post.data()?.titulo,
        post.data()?.descripcion,
        post.data()?.videoLink,
        post.data()?.imagenLink,
        post.data()?.calificacion,
        Utilidad.obtenerFecha(post.data().fecha?.toDate()), //segundos 42342342342
        post?.id,
        $("#tituloPost").text() === 'Mis Posts'
    )
    $("#posts").append(postHtml)
  }

  obtenerTemplatePostVacio () {
    return `<article class="post">
      <div class="post-titulo">
          <h5>Crea el primer Post a la comunidad</h5>
      </div>
      <div class="post-calificacion">
          <a class="post-estrellita-vacia" href="*"></a>
          <a class="post-estrellita-vacia" href="*"></a>
          <a class="post-estrellita-vacia" href="*"></a>
          <a class="post-estrellita-vacia" href="*"></a>
          <a class="post-estrellita-vacia" href="*"></a>
      </div>
      <div class="post-video">
          <iframe type="text/html" width="500" height="385" src='https://www.youtube.com/embed/bTSWzddyL7E?ecver=2'
              frameborder="0"></iframe>
          </figure>
      </div>
      <div class="post-videolink">
          Video
      </div>
      <div class="post-descripcion">
          <p>Crea el primer Post a la comunidad</p>
      </div>
      <div class="post-footer container">         
      </div>
  </article>`
  }

  obtenerPostTemplate (
    autor,
    titulo,
    descripcion,
    videoLink,
    imagenLink,
    calificacion,
    fecha,
    id,
    condicion
  ) {
    
    let botonesAccion = ""
    if(condicion){
        botonesAccion = /*html*/`<div class="col m6 right-align" style="padding-right: 15px;">
            <a class="btn-floating waves-effect waves-light btnPpal" onclick="editPost('${id}')"><i class="material-icons">edit</i></a>
            <a class="btn-floating waves-effect waves-light red" onclick="deletePost('${id}')"><i class="material-icons">delete</i></a>
        </div>`
    }

    //obtener la calificacion
    let avgEstrellas = 0

    if(calificacion){
        const suma = calificacion.reduce((a, b) => a + b.estrellas, 0)
        const avg = (suma / calificacion.length) || 0
        avgEstrellas = Math.round(avg)
    }

    if (imagenLink) {
      return /*html*/`<article class="post">
                    <div class="post-titulo">
                        <h5>${titulo}</h5>
                    </div>
                    <div class="post-calificacion">
                        <a class="post-estrellita-${1 <= avgEstrellas ? 'llena' : 'vacia'}" onclick="colocarEstrellas(1, '${id}')"></a>
                        <a class="post-estrellita-${2 <= avgEstrellas ? 'llena' : 'vacia'}" onclick="colocarEstrellas(2, '${id}')"></a>
                        <a class="post-estrellita-${3 <= avgEstrellas ? 'llena' : 'vacia'}" onclick="colocarEstrellas(3, '${id}')"></a>
                        <a class="post-estrellita-${4 <= avgEstrellas ? 'llena' : 'vacia'}" onclick="colocarEstrellas(4, '${id}')"></a>
                        <a class="post-estrellita-${5 <= avgEstrellas ? 'llena' : 'vacia'}" onclick="colocarEstrellas(5, '${id}')"></a>
                    </div>
                    <div class="post-video">                
                        <img id="imgVideo" src='${imagenLink}' class="post-imagen-video" 
                            alt="Imagen Video">     
                    </div>
                    <div class="post-videolink">
                        <a href="${videoLink}" target="blank">Ver Video</a>                            
                    </div>
                    <div class="post-descripcion">
                        <p>${descripcion}</p>
                    </div>
                    <div class="post-footer container">
                        <div class="row">
                            <div class="col m6">
                                Fecha: ${fecha}
                            </div>
                            ${botonesAccion}
                            <div class="col m6">
                                Autor: ${autor}
                            </div>        
                        </div>
                    </div>
                </article>`
    }

    return /*html*/`<article class="post">
                        <div class="post-titulo">
                            <h5>${titulo}</h5>
                        </div>
                        <div class="post-calificacion">
                            <a class="post-estrellita-${1 <= avgEstrellas ? 'llena' : 'vacia'}" onclick="colocarEstrellas(1, '${id}')"></a>
                            <a class="post-estrellita-${2 <= avgEstrellas ? 'llena' : 'vacia'}" onclick="colocarEstrellas(2, '${id}')"></a>
                            <a class="post-estrellita-${3 <= avgEstrellas ? 'llena' : 'vacia'}" onclick="colocarEstrellas(3, '${id}')"></a>
                            <a class="post-estrellita-${4 <= avgEstrellas ? 'llena' : 'vacia'}" onclick="colocarEstrellas(4, '${id}')"></a>
                            <a class="post-estrellita-${5 <= avgEstrellas ? 'llena' : 'vacia'}" onclick="colocarEstrellas(5, '${id}')"></a>
                        </div>
                        <div class="post-video">
                            <iframe type="text/html" width="500" height="385" src='${videoLink}'
                                frameborder="0"></iframe>
                            </figure>
                        </div>
                        <div class="post-videolink">
                            Video
                        </div>
                        <div class="post-descripcion">
                            <p>${descripcion}</p>
                        </div>
                        <div class="post-footer container">
                            <div class="row">
                                <div class="col m6">
                                    Fecha: ${fecha}
                                </div>
                                ${botonesAccion}
                                <div class="col m6">
                                    Autor: ${autor}
                                </div>        
                            </div>
                        </div>
                    </article>`
  }

  subirImagenPost(file, uid, esPerfil){
    if(file.size > 5 * 1024 * 1024){
        Materialize.toast(`No se puede subir este archivo porque pesa más de 5MB`, 4000)
        return
    }

      const storage = firebase.storage()
    // firebase verifica si existe la ruta sino la crea
    // uid : usuario
      const referenceStorage = storage.ref(`imagenPost/${uid}/${file?.name}`)
      const task = referenceStorage.put(file)

    // tarea que se ejecuta cuando se carga el archivo
    task.on('state_changed', snapshot => {
        // porcentaje actual de la subida del archivo - 0 30 60 100
        const porcentaje = snapshot.bytesTransferred / snapshot.totalBytes * 100
        $(".determinate").attr("style", `width: ${porcentaje}%`)
    },
    error => {
        Materialize.toast(`Error subiendo archivo => ${error.message}`, 4000)
        $(".determinate").attr("style", `width: 0%`)
    },
    //funcion que se ejecuta una vez se complete la subida
    () => {
        task.snapshot.ref.getDownloadURL()
            .then(url => {
                console.log(url);
                if(esPerfil){
                    sessionStorage.setItem('imgPerfil', url)
                    $("#imagen-perfil").attr("style", "display: block;")
                    $("#imagen-perfil").attr("src", url)
                }
                else {
                    sessionStorage.setItem('imgNewPost', url)
                    $("#imagen-subida").attr("style", "display: block;")
                    $("#imagen-subida").attr("src", url)
                }
                
            })
            .catch (error => {
                Materialize.toast(`Error obteniendo URL => ${error.message}`, 4000)
                $(".determinate").attr("style", `width: 0%`)
            })
    })  
  }

  guardarFotoPerfil(idPerfil, uid, nombres, foto){
    if(idPerfil == ''){
        this.db
        .collection('perfil')
        .add({
        uid,
        nombres,
        foto
        })
        .then(docRef => {
            console.log(`UID is => ${docRef.id}`)
        })
    }
    else {
        const perfil = this.db.collection('perfil').doc(idPerfil)

        perfil.update({
            uid,
            nombres,
            foto
        })
        .then(docRef => {
            console.log(`Se modificó el ID => ${idPerfil}`)
        })
    }
  }

  obtenerFotoPerfil(user){
    this
        .db
        .collection('perfil')
        .where('uid', '==', user.uid)
        // tiempo real
        .onSnapshot(res => {
            if(res.empty){
                $('#avatar').attr('src', user.photoURL)
            }
            else{
                res.forEach(foto => {
                    $('#avatar').attr('src', foto.data()?.foto)
                    $(".nombrePerfil").attr("style", "display: block;")
                    $(".nombrePerfil").text(foto.data()?.nombres)

                    // Completar los datos del formulario
                    $("#idPerfil").val(foto?.id)
                    $("#nombrePerfil").val(foto.data()?.nombres)

                    $(".determinate").attr("style", "width: 100%")
                    $("#imagen-perfil").attr("style", "display: block;")
                    $("#imagen-perfil").attr("src", foto.data()?.foto)
                    sessionStorage.setItem('imgPerfil', foto.data()?.foto)
                    return
                })
            }
        })
  }

  obtenerDesplegableBusqueda(busqueda){
      this
        .db
        .collection("posts")
        // LIKE SQL
        .where("titulo", ">=", busqueda)
        .where("titulo", "<=", busqueda + "\uf8ff")
        .limit(3)
        .get()
        .then(query => {
            $("#data-encontrada").empty()
            if(!query.empty){
                query.forEach(post => {
                    let postHtml = /*html*/`<li onclick="seleccionado('${post?.id}')">${post.data()?.titulo}</li>`
                    $("#data-encontrada").append(postHtml)
                })
            }
        })
  }

  async guardarCalificacion(numeroEstrellas, id){
      const refPost = this.db.collection("posts").doc(id)
      const post = await refPost.get()

      // Usuario logueado
      const user = firebase.auth().currentUser

      // Verificar si ya voto
      const existeCalificacion = post.data()?.calificacion

      if(!existeCalificacion){
        return refPost.update({
            calificacion: [{
                idUser: user.uid,
                estrellas: numeroEstrellas
            }]
        })
        .catch(error => {
            console.log(`Error al calificar el post ${error.message}`);
        })
      }
      else {
          const existeUsuario = post.data().calificacion.findIndex(x => x.idUser == user.uid)
          let calificacion = post.data().calificacion // 2 elementos
          if(existeUsuario > -1){
            //   Reemplazar la votacion que ya tenia
              calificacion[existeUsuario] = {
                  idUser: user.uid,
                  estrellas: numeroEstrellas
              }
          } else {
              calificacion = [...calificacion, { // agregar 1 mas, es decir 3 elementos
                idUser: user.uid,
                estrellas: numeroEstrellas
              }]
          }

          return refPost.update({
              calificacion
          })
          .catch(error => {
            console.log(`Error al calificar el post ${error.message}`);
          })
      }
  }
}
