import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  location: string = 'Ubicación no disponible';
  currentTime: string = '';

  setLocation(location: string) {
    this.location = location;
  }

  async getLocationFromCoordinates(latitude: number, longitude: number): Promise<string> {
    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=78175b5c92ae48dfb72db55b721e69ed`);
      const data = response.data;
      if (data.results && data.results.length > 0) {
        const components = data.results[0].components;
        const region = components.state || components.county;
        const comuna = components.city || components.town || components.village;
        const place = `${comuna}, ${region}`;
        this.location = place;
        return place;
      } else {
        return 'Ubicación no encontrada';
      }
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
      return 'Ubicación no disponible';
    }
  }

  constructor() { }

  getCurrentTime(): string {
    const currentDate = new Date();
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    this.currentTime = `${hours}:${minutes}`;
    return this.currentTime;
  }
}
