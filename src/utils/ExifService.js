import EXIF from 'exif-js';

/**
 * Serviço para extração de metadados EXIF de imagens
 * Inclui geolocalização, data/hora, informações da câmera
 */

class ExifService {
  /**
   * Extrai todos os metadados EXIF de uma imagem
   * @param {File} imageFile - Arquivo de imagem
   * @returns {Promise<Object>} Metadados extraídos
   */
  static async extractMetadata(imageFile) {
    return new Promise((resolve) => {
      EXIF.getData(imageFile, function() {
        try {
          const allMetaData = EXIF.getAllTags(this);
          
          const result = {
            location: ExifService.extractLocation(allMetaData),
            datetime: ExifService.extractDateTime(allMetaData),
            camera: ExifService.extractCameraInfo(allMetaData),
            technical: ExifService.extractTechnicalInfo(allMetaData),
            raw: allMetaData
          };
          
          resolve(result);
        } catch (error) {
          console.error('Erro ao extrair metadados EXIF:', error);
          resolve(null);
        }
      });
    });
  }

  /**
   * Extrai informações completas de geolocalização e contexto
   * @param {Object} tags - Tags EXIF
   * @returns {Object|null} Dados detalhados de localização
   */
  static extractLocation(tags) {
    try {
      const gpsLat = tags['GPSLatitude'];
      const gpsLatRef = tags['GPSLatitudeRef'];
      const gpsLon = tags['GPSLongitude'];
      const gpsLonRef = tags['GPSLongitudeRef'];
      const gpsAlt = tags['GPSAltitude'];
      const gpsTimestamp = tags['GPSTimeStamp'];
      const gpsDateStamp = tags['GPSDateStamp'];

      if (!gpsLat || !gpsLon) {
        return null;
      }

      // Converte coordenadas DMS para decimal
      const latitude = this.dmsToDecimal(
        gpsLat,
        gpsLatRef
      );
      const longitude = this.dmsToDecimal(
        gpsLon,
        gpsLonRef
      );

      return {
        // Coordenadas básicas
        latitude,
        longitude,
        
        // Informações de altitude
        altitude: gpsAlt || null,
        altitudeRef: tags['GPSAltitudeRef'] || null,
        
        // Informações temporais GPS
        timestamp: gpsTimestamp || null,
        datestamp: gpsDateStamp || null,
        
        // Informações de precisão e qualidade
        satellites: tags['GPSSatellites'] || null,
        status: tags['GPSStatus'] || null,
        measureMode: tags['GPSMeasureMode'] || null,
        dop: tags['GPSDOP'] || null, // Dilution of Precision
        
        // Informações direcionais
        speed: tags['GPSSpeed'] || null,
        speedRef: tags['GPSSpeedRef'] || null,
        track: tags['GPSTrack'] || null,
        trackRef: tags['GPSTrackRef'] || null,
        imgDirection: tags['GPSImgDirection'] || null,
        imgDirectionRef: tags['GPSImgDirectionRef'] || null,
        destBearing: tags['GPSDestBearing'] || null,
        destBearingRef: tags['GPSDestBearingRef'] || null,
        
        // Informações de área e contexto
        areaInformation: tags['GPSAreaInformation'] || null,
        processingMethod: tags['GPSProcessingMethod'] || null,
        versionID: tags['GPSVersionID'] || null,
        
        // Informações de diferencial GPS
        differential: tags['GPSDifferential'] || null,
        
        // Coordenadas formatadas para exibição
        accuracy: this.calculateAccuracy(tags),
        coordinates: `${latitude}, ${longitude}`,
        coordinatesFormatted: {
          decimal: `${latitude}, ${longitude}`,
          dms: {
            latitude: `${Math.abs(latitude).toFixed(6)}° ${gpsLatRef}`,
            longitude: `${Math.abs(longitude).toFixed(6)}° ${gpsLonRef}`
          }
        }
      };
    } catch (error) {
      console.error('Erro ao extrair localização:', error);
      return null;
    }
  }

  /**
   * Extrai informações de data e hora
   * @param {Object} tags - Tags EXIF
   * @returns {Object|null} Dados de data/hora
   */
  static extractDateTime(tags) {
    try {
      const dateTime = tags['DateTime'];
      const dateTimeOriginal = tags['DateTimeOriginal'];
      const dateTimeDigitized = tags['DateTimeDigitized'];
      const subSecTime = tags['SubSecTime'];
      const timeZone = tags['OffsetTime'];

      return {
        dateTime: this.parseExifDateTime(dateTime),
        dateTimeOriginal: this.parseExifDateTime(dateTimeOriginal),
        dateTimeDigitized: this.parseExifDateTime(dateTimeDigitized),
        subSeconds: subSecTime,
        timeZone: timeZone,
        timestamp: dateTimeOriginal ? 
          new Date(this.parseExifDateTime(dateTimeOriginal)).getTime() : null
      };
    } catch (error) {
      console.error('Erro ao extrair data/hora:', error);
      return null;
    }
  }

  /**
   * Extrai informações detalhadas da câmera e equipamento
   * @param {Object} tags - Tags EXIF
   * @returns {Object} Dados completos da câmera
   */
  static extractCameraInfo(tags) {
    return {
      // Informações básicas da câmera
      make: tags['Make'] || null,
      model: tags['Model'] || null,
      software: tags['Software'] || null,
      firmware: tags['FirmwareVersion'] || null,
      serialNumber: tags['SerialNumber'] || null,
      
      // Informações da lente
      lens: {
        model: tags['LensModel'] || null,
        make: tags['LensMake'] || null,
        serialNumber: tags['LensSerialNumber'] || null,
        specification: tags['LensSpecification'] || null,
        minFocalLength: tags['LensMinFocalLength'] || null,
        maxFocalLength: tags['LensMaxFocalLength'] || null,
        maxApertureAtMinFocal: tags['LensMaxApertureAtMinFocal'] || null,
        maxApertureAtMaxFocal: tags['LensMaxApertureAtMaxFocal'] || null
      },
      
      // Configurações do equipamento
      bodySerialNumber: tags['BodySerialNumber'] || null,
      cameraOwnerName: tags['CameraOwnerName'] || null,
      copyright: tags['Copyright'] || null,
      artist: tags['Artist'] || null,
      
      // Informações técnicas do sensor
      sensorType: tags['SensorType'] || null,
      cfaPattern: tags['CFAPattern'] || null,
      customRendered: tags['CustomRendered'] || null,
      
      // Configurações específicas do fabricante
      makerNote: tags['MakerNote'] ? 'Presente' : null,
      userComment: tags['UserComment'] || null,
      imageDescription: tags['ImageDescription'] || null,
      
      // Informações de processamento
      processingMethod: tags['ProcessingMethod'] || null,
      imageUniqueID: tags['ImageUniqueID'] || null
    };
  }

  /**
   * Extrai informações técnicas detalhadas da foto
   * @param {Object} tags - Tags EXIF
   * @returns {Object} Dados técnicos completos
   */
  static extractTechnicalInfo(tags) {
    return {
      // Configurações básicas
      iso: tags['ISOSpeedRatings'] || null,
      aperture: tags['FNumber'] || null,
      shutterSpeed: tags['ExposureTime'] || null,
      focalLength: tags['FocalLength'] || null,
      focalLengthIn35mm: tags['FocalLengthIn35mmFilm'] || null,
      
      // Configurações de exposição
      exposureMode: tags['ExposureMode'] || null,
      exposureProgram: tags['ExposureProgram'] || null,
      exposureBias: tags['ExposureBiasValue'] || null,
      meteringMode: tags['MeteringMode'] || null,
      
      // Flash e iluminação
      flash: tags['Flash'] || null,
      flashMode: tags['FlashMode'] || null,
      whiteBalance: tags['WhiteBalance'] || null,
      colorSpace: tags['ColorSpace'] || null,
      
      // Qualidade e formato
      orientation: tags['Orientation'] || null,
      compression: tags['Compression'] || null,
      photometricInterpretation: tags['PhotometricInterpretation'] || null,
      
      // Resolução e dimensões
      resolution: {
        x: tags['XResolution'] || null,
        y: tags['YResolution'] || null,
        unit: tags['ResolutionUnit'] || null
      },
      imageWidth: tags['ImageWidth'] || tags['PixelXDimension'] || null,
      imageHeight: tags['ImageHeight'] || tags['PixelYDimension'] || null,
      
      // Informações de cor
      bitsPerSample: tags['BitsPerSample'] || null,
      samplesPerPixel: tags['SamplesPerPixel'] || null,
      
      // Configurações avançadas
      sceneCaptureType: tags['SceneCaptureType'] || null,
      gainControl: tags['GainControl'] || null,
      contrast: tags['Contrast'] || null,
      saturation: tags['Saturation'] || null,
      sharpness: tags['Sharpness'] || null,
      
      // Informações de processamento
      digitalZoomRatio: tags['DigitalZoomRatio'] || null,
      subjectDistance: tags['SubjectDistance'] || null,
      subjectDistanceRange: tags['SubjectDistanceRange'] || null
    };
  }

  /**
   * Converte coordenadas DMS (Degrees, Minutes, Seconds) para decimal
   * @param {Array} dms - Coordenada em formato DMS [degrees, minutes, seconds]
   * @param {string} ref - Referência (N, S, E, W)
   * @returns {number} Coordenada decimal
   */
  static dmsToDecimal(dms, ref) {
    if (!dms || !Array.isArray(dms) || dms.length < 3) return null;
    
    const degrees = dms[0];
    const minutes = dms[1];
    const seconds = dms[2];

    let decimal = degrees + (minutes / 60) + (seconds / 3600);

    // Aplica sinal baseado na referência
    if (ref && (ref === 'S' || ref === 'W')) {
      decimal = -decimal;
    }

    return decimal;
  }

  /**
   * Calcula a precisão estimada do GPS
   * @param {Object} tags - Tags EXIF
   * @returns {number|null} Precisão em metros
   */
  static calculateAccuracy(tags) {
    const dilution = tags['GPSDOP']?.description;
    if (dilution) {
      // Estimativa baseada no DOP (Dilution of Precision)
      return parseFloat(dilution) * 5; // Aproximação em metros
    }
    return null;
  }

  /**
   * Converte data/hora EXIF para formato ISO
   * @param {string} exifDateTime - Data/hora no formato EXIF
   * @returns {string|null} Data/hora em formato ISO
   */
  static parseExifDateTime(exifDateTime) {
    if (!exifDateTime) return null;
    
    try {
      // Formato EXIF: "YYYY:MM:DD HH:MM:SS"
      const formatted = exifDateTime.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
      return new Date(formatted).toISOString();
    } catch (error) {
      console.error('Erro ao converter data EXIF:', error);
      return null;
    }
  }

  /**
   * Verifica se a imagem possui dados de geolocalização
   * @param {File} imageFile - Arquivo de imagem
   * @returns {Promise<boolean>} True se possui GPS
   */
  static async hasGeoLocation(imageFile) {
    const metadata = await this.extractMetadata(imageFile);
    return metadata?.location?.latitude && metadata?.location?.longitude;
  }

  /**
   * Extrai apenas as coordenadas de uma imagem
   * @param {File} imageFile - Arquivo de imagem
   * @returns {Promise<Object|null>} Coordenadas lat/lng
   */
  static async getCoordinates(imageFile) {
    const metadata = await this.extractMetadata(imageFile);
    if (metadata?.location?.latitude && metadata?.location?.longitude) {
      return {
        lat: metadata.location.latitude,
        lng: metadata.location.longitude
      };
    }
    return null;
  }

  /**
   * Formata metadados para exibição
   * @param {Object} metadata - Metadados extraídos
   * @returns {Object} Metadados formatados
   */
  static formatForDisplay(metadata) {
    if (!metadata) return null;

    return {
      localização: metadata.location ? {
        coordenadas: metadata.location.coordinates,
        latitude: metadata.location.latitude?.toFixed(6),
        longitude: metadata.location.longitude?.toFixed(6),
        altitude: metadata.location.altitude,
        precisão: metadata.location.accuracy ? `${metadata.location.accuracy.toFixed(1)}m` : 'N/A'
      } : 'Não disponível',
      
      dataHora: metadata.datetime?.dateTimeOriginal ? 
        new Date(metadata.datetime.dateTimeOriginal).toLocaleString('pt-BR') : 'Não disponível',
      
      câmera: metadata.camera?.make && metadata.camera?.model ? 
        `${metadata.camera.make} ${metadata.camera.model}` : 'Não disponível',
      
      configurações: {
        iso: metadata.technical?.iso || 'N/A',
        abertura: metadata.technical?.aperture || 'N/A',
        velocidade: metadata.technical?.shutterSpeed || 'N/A',
        focalLength: metadata.technical?.focalLength || 'N/A'
      }
    };
  }
}

export default ExifService;