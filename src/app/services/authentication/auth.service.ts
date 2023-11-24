import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { FirestoreService } from '../firebase/store/firestore.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private toastController: ToastController,
    private firestoreService: FirestoreService,

  ) { }

  async registrarUsuarioConInfo(email: string, password: string, userData: any): Promise<any> {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user && user.email) {
        // Almacenar los datos del usuario en Firestore
        await this.firestoreService.guardarDatosUsuarioFirestore(user.email, userData);

        // Almacenar los datos del usuario en localStorage
        const registeredUser = {
          fotoTomada: userData.fotoTomada,
          names: userData.names,
          direccion: userData.direccion,
          fechaNacimiento: userData.fechaNacimiento,
          email: user.email,
          numero: userData.numero
        };
        localStorage.setItem('registeredUser', JSON.stringify(registeredUser));

        // Redirigir al usuario después del registro
        this.router.navigate(['main-drive/main']);

        // Devolver el usuario creado
        return userCredential;
      } else {
        console.error('El objeto user o user.email es nulo o indefinido después del registro');
        throw new Error('Error de registro');
      }
    } catch (error) {
      console.error('Error al registrar: ', error);
      throw error;
    }
  }

  // Obtener datos del usuario registrado desde el localStorage
  obtenerDatosUsuarioRegistradoPorEmail(): any {
    const registeredUserString = localStorage.getItem('registeredUser');
    if (registeredUserString) {
      return JSON.parse(registeredUserString);
    } else {
      return null;
    }
  }

  obtenerDatosUsuarioLogueado(): any {
    const loggedUserString = localStorage.getItem('loggedUser');
    if (loggedUserString) {
      return JSON.parse(loggedUserString);
    } else {
      return null;
    }
  }

  iniciarSesion(email: string, password: string): Promise<any> {
    // Aquí se inicia sesión con el correo electrónico y contraseña
    return this.afAuth.signInWithEmailAndPassword(email, password)
      //entonces si las credenciales
      .then(async (userCredential) => {
        //son exitosas
        const user = userCredential.user;

        if (user) {
          // si existe el usuario se guardara la información del usuario en el localStorage
          const loggedUser = {
            email: user.email,
          };

          localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

          // aqui verifico que los datos de usuario registrado están en el localStorage
          const registeredUserString = localStorage.getItem('registeredUser');
          // Si en caso no hay o no existe el objeto o local storage registeredUser
          if (!registeredUserString) {
            // Llamo a la función obtenerDatosUsuario del servicio firestore para obtener los datos del usuario mediante el email
            const userDataFromFirestore = await this.firestoreService.obtenerDatosUsuario(email);
            // si se obtienen datos del Firestore, se creara o se almacenaran en un localStorage registeredUser y se obtendran
            if (userDataFromFirestore) {
              localStorage.setItem('registeredUser', JSON.stringify(userDataFromFirestore));
            }
          }

          return userCredential;
        } else {
          throw new Error('Error de inicio de sesión');
        }
      })
      .catch(error => {
        if (error.code === 'auth/user-not-found') {
          // Si el usuario no se encuentra, que muestre un mensaje para que vuelva a intentarlo
          this.mostrarMensajeError('Usuario no encontrado. Por favor, verifica el correo.');
        } else {
          // Si el error no es de "usuario no encontrado", mostrar un mensaje para que se registre o verifique las credenciales 
          this.mostrarMensajeError('Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.');
        }
        throw error;
      });
  }


  // Agrege una función para verificar si existe un usuario en el sistema
  verificarExistenciaUsuario(email: string): Promise<boolean> {
    return this.afAuth.fetchSignInMethodsForEmail(email)
      .then(signInMethods => {
        // Si signInMethods es un arreglo vacío, el usuario no existe
        return signInMethods.length > 0;
      });
  }

  // Agrege una función que muestra un mensaje de error con ToastController que la generara de arriba y sera durante 3 segundos
  async mostrarMensajeError(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // agregue una funcion o metodo para cerrar sesión
  cerrarSesion(): Promise<void> {
    // aqui Cerrara la sesión en Firebase
    return this.afAuth.signOut()
      .then(() => {
        // aqui eliminare cada localstorage para que en caso de inicio de sesion no obtenga los datos asociados a otra cuenta
        // Limpiar el localStorage
        const itemsToRemove = ['loggedUser', 'registeredUser', 'vehiculoExistente', 'HistorialCompras'];
        itemsToRemove.forEach(item => localStorage.removeItem(item));

        // al cerrar sesuib que rediriga al usuario a la página de inicio de sesión
        this.router.navigate(['main-login/login']);
      })
      //este es para manejar el error en caso de
      .catch(error => {
        console.error('Error al cerrar sesión: ', error);
        throw error;
      });
  }

  // Esta funcion o Metodo lo usare para verificar el estado de autenticación del usuario
  obtenerEstadoAutenticacion(): Observable<any> {
    return this.afAuth.authState;
  }

  // Esta funcion o metodo lo usare para enviar un correo de recuperación de contraseña
  enviarCorreoRecuperacion(email: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email);
  }
}