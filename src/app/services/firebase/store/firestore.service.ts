import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, collection, addDoc, query, where, getDocs, QuerySnapshot, DocumentData, deleteDoc, doc } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(
    private firestore: Firestore,
    private afAuth: AngularFireAuth,
    private alertController: AlertController
  ) { }

  async guardarDatosUsuarioFirestore(email: string, userData: any) {
    // Referencia a la colección de usuarios en Firestore
    const usersCollection = collection(this.firestore, 'usuarios');

    // Datos del usuario a guardar
    const usuario = {
      fotoTomada: userData.fotoTomada,
      names: userData.names,
      direccion: userData.direccion,
      fechaNacimiento: userData.fechaNacimiento,
      email: email,
      numero: userData.numero
    };

    try {
      // Agregar los datos del usuario a Firestore
      await addDoc(usersCollection, usuario);
      console.log('Datos del usuario guardados en Firestore con éxito.');
    } catch (error) {
      console.error('Error al guardar los datos del usuario en Firestore:', error);
      throw error;
    }
  }

  async obtenerDatosUsuario(email: string) {
    const usuariosQuery = query(collection(this.firestore, 'usuarios'), where('email', '==', email));
    const usuariosSnapshot = await getDocs(usuariosQuery);

    if (usuariosSnapshot.size > 0) {
      const usuarioDoc = usuariosSnapshot.docs[0];
      const usuarioData = usuarioDoc.data();
      return usuarioData;
    } else {
      return null;
    }
  }


  async agregarDatosDeVehiculo(datosVehiculo: any) {
    const user = await this.afAuth.currentUser;

    if (user) {
      const userEmail = user.email;

      const vehiculosQuery = query(collection(this.firestore, 'regvehiculos'), where('propietario', '==', userEmail));
      const vehiculosSnapshot = await getDocs(vehiculosQuery);

      if (vehiculosSnapshot.size > 0) {
        console.log('El usuario ya ha registrado un vehículo.');

        this.mostrarAlerta('¡Atención!', 'Usted ya ha registrado un vehículo.');

      } else {
        datosVehiculo.propietario = userEmail;

        const vehiculosQuery2 = query(collection(this.firestore, 'regvehiculos'), where('propietario', '==', userEmail));
        const vehiculosSnapshot2 = await getDocs(vehiculosQuery2);

        if (vehiculosSnapshot2.size > 0) {
          console.log('Ya existe un vehículo registrado con este propietario.');

          this.mostrarAlerta('¡Atención!', 'Ya ha registrado un vehículo anteriormente.');

        } else {
          await addDoc(collection(this.firestore, 'regvehiculos'), datosVehiculo);
          window.location.reload();
        }
      }
    }
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  async obtenerDatosDelVehiculo(email: string) {
    const vehiculosQuery = query(collection(this.firestore, 'regvehiculos'), where('propietario', '==', email));
    const vehiculosSnapshot = await getDocs(vehiculosQuery);

    if (vehiculosSnapshot.size > 0) {
      const vehiculoDoc = vehiculosSnapshot.docs[0];
      const vehiculoData = vehiculoDoc.data();
      return vehiculoData;
    } else {
      return null;
    }
  }

  obtenerVehiculosRegistrados(): Observable<any[]> {
    const vehiculosCollection = collection(this.firestore, 'regvehiculos');
    const vehiculosQuery = query(vehiculosCollection);

    return new Observable((observer) => {
      getDocs(vehiculosQuery)
        .then((querySnapshot: QuerySnapshot<DocumentData>) => {
          const vehiculos: any[] = [];
          querySnapshot.forEach((doc) => {
            vehiculos.push(doc.data());
          });
          observer.next(vehiculos);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  async mostrarAlertaConfirmacion(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Confirmación',
        message: '¿Estás seguro de que quieres eliminar tu vehículo?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => resolve(false),
          },
          {
            text: 'Sí',
            handler: () => resolve(true),
          },
        ],
      });

      await alert.present();
    });
  }

  async eliminarVehiculo() {
    const user = await this.afAuth.currentUser;

    if (user) {
      const confirmacion = await this.mostrarAlertaConfirmacion();

      if (!confirmacion) {
        return; // El usuario seleccionó "No", cancelar la eliminación.
      }

      const userEmail = user.email;

      try {
        // Obtener el documento del vehículo del usuario actual
        const vehiculoQuery = query(collection(this.firestore, 'regvehiculos'), where('propietario', '==', userEmail));
        const vehiculoSnapshot = await getDocs(vehiculoQuery);

        if (vehiculoSnapshot.size > 0) {
          const vehiculoDoc = vehiculoSnapshot.docs[0];

          // Eliminar el documento del vehículo
          await deleteDoc(doc(this.firestore, 'regvehiculos', vehiculoDoc.id));

          this.mostrarAlerta('¡Éxito!', 'Vehículo eliminado exitosamente.');

          // Recargar la página después de la eliminación
          window.location.reload();
        } else {
          this.mostrarAlerta('¡Error!', 'No se encontró el vehículo para eliminar.');
        }
      } catch (error) {
        console.error('Error al eliminar el vehículo', error);
        this.mostrarAlerta('¡Error!', 'Ocurrió un error al intentar eliminar el vehículo.');
      }
    }
  }

  getAuthInstance() {
    return this.afAuth;
  }

  async agregarResumenCompra(resumenCompra: any) {
    try {
      const user = await this.afAuth.currentUser;

      if (user) {
        const resumenCompraCollection = collection(
          this.firestore,
          'resumenesCompra'
        );

        await addDoc(resumenCompraCollection, resumenCompra);
        console.log('Resumen de compra guardado en Firestore con éxito.');
      }
    } catch (error) {
      console.error(
        'Error al agregar el resumen de compra en Firestore:',
        error
      );
    }
  }

  obtenerHistorialCompras(email: string): Observable<any[]> {
    const resumenesCompraQuery = query(collection(this.firestore, 'resumenesCompra'), where('titularPago', '==', email));
    return new Observable((observer) => {
      getDocs(resumenesCompraQuery)
        .then((querySnapshot) => {
          const historialCompras: any[] = [];
          querySnapshot.forEach((resumenCompraDoc) => {
            historialCompras.push(resumenCompraDoc.data());
          });
          observer.next(historialCompras);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  async eliminarDatosUsuario(email: string) {
    try {
      // Eliminar vehículo del collection 'regvehiculos'
      const vehiculoQuery = query(collection(this.firestore, 'regvehiculos'), where('propietario', '==', email));
      const vehiculoSnapshot = await getDocs(vehiculoQuery);
      vehiculoSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // Eliminar resumen de compra del collection 'resumenesCompra'
      const resumenCompraQuery = query(collection(this.firestore, 'resumenesCompra'), where('titularPago', '==', email));
      const resumenCompraSnapshot = await getDocs(resumenCompraQuery);
      resumenCompraSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // Eliminar usuario del collection 'usuarios'
      const usuarioQuery = query(collection(this.firestore, 'usuarios'), where('email', '==', email));
      const usuarioSnapshot = await getDocs(usuarioQuery);
      usuarioSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } catch (error) {
      console.error('Error al eliminar datos del usuario:', error);
      throw error;
    }
  }
}