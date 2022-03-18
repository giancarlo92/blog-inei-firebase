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
                        Utilidad.obtenerFecha(post.data().fecha?.toDate()), //segundos 42342342342
                        null
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
                        Utilidad.obtenerFecha(post.data().fecha?.toDate()), //segundos 42342342342
                        post?.id
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
        Utilidad.obtenerFecha(post.data().fecha?.toDate()), //segundos 42342342342
        post?.id
    )
    $("#posts").append(postHtml)
  }

  obtenerTemplatePostVacio () {
    return `<article class="post">
      <div class="post-titulo">
          <h5>Crea el primer Post a la comunidad</h5>
      </div>
      <div class="post-calificacion">
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-llena" href="*"></a>
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
    fecha,
    id
  ) {
    
    let botonesAccion = ""
    if(id != null){
        botonesAccion = /*html*/`<div class="col m6 right-align" style="padding-right: 15px;">
            <a class="btn-floating waves-effect waves-light btnPpal" onclick="editPost('${id}')"><i class="material-icons">edit</i></a>
            <a class="btn-floating waves-effect waves-light red" onclick="deletePost('${id}')"><i class="material-icons">delete</i></a>
        </div>`
    }


    if (imagenLink) {
      return /*html*/`<article class="post">
                    <div class="post-titulo">
                        <h5>${titulo}</h5>
                    </div>
                    <div class="post-calificacion">
                        <a class="post-estrellita-llena" href="*"></a>
                        <a class="post-estrellita-llena" href="*"></a>
                        <a class="post-estrellita-llena" href="*"></a>
                        <a class="post-estrellita-llena" href="*"></a>
                        <a class="post-estrellita-vacia" href="*"></a>
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
                            <a class="post-estrellita-llena" href="*"></a>
                            <a class="post-estrellita-llena" href="*"></a>
                            <a class="post-estrellita-llena" href="*"></a>
                            <a class="post-estrellita-llena" href="*"></a>
                            <a class="post-estrellita-vacia" href="*"></a>
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

  subirImagenPost(file, uid){
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
                sessionStorage.setItem('imgNewPost', url)
                $("#imagen-subida").attr("style", "display: block;")
                $("#imagen-subida").attr("src", url)
            })
            .catch (error => {
                Materialize.toast(`Error obteniendo URL => ${error.message}`, 4000)
                $(".determinate").attr("style", `width: 0%`)
            })
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
}
