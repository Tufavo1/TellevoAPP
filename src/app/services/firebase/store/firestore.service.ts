import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, collection, addDoc, query, where, getDocs, QuerySnapshot, DocumentData } from '@angular/fire/firestore';
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

        const localStorageKey = `resumenCompra`;
        localStorage.setItem(localStorageKey, JSON.stringify(resumenCompra));
        console.log('Resumen de compra guardado en localStorage con éxito.');
      } else {
        console.log(
          'Usuario no autenticado. No se puede agregar el resumen de compra.'
        );
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
}