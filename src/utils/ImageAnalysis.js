/**
 * Biblioteca de Análise de Imagens para Avaliação de Imóveis
 * Extrai características visuais e compara imagens para análise de valor
 */

class ImageAnalysis {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  /**
   * Carrega uma imagem e retorna uma Promise com o elemento Image
   */
  async loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  /**
   * Extrai características básicas da imagem
   */
  async extractFeatures(imageSrc) {
    try {
      const img = await this.loadImage(imageSrc);
      
      // Configurar canvas
      this.canvas.width = img.width;
      this.canvas.height = img.height;
      this.ctx.drawImage(img, 0, 0);
      
      const imageData = this.ctx.getImageData(0, 0, img.width, img.height);
      const pixels = imageData.data;
      
      return {
        dimensions: {
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height
        },
        colorAnalysis: this.analyzeColors(pixels),
        brightness: this.calculateBrightness(pixels),
        contrast: this.calculateContrast(pixels),
        sharpness: this.calculateSharpness(imageData),
        dominantColors: this.getDominantColors(pixels),
        qualityScore: this.calculateQualityScore(img, pixels)
      };
    } catch (error) {
      console.error('Erro ao extrair características:', error);
      return null;
    }
  }

  /**
   * Analisa distribuição de cores
   */
  analyzeColors(pixels) {
    let totalR = 0, totalG = 0, totalB = 0;
    const pixelCount = pixels.length / 4;
    
    for (let i = 0; i < pixels.length; i += 4) {
      totalR += pixels[i];
      totalG += pixels[i + 1];
      totalB += pixels[i + 2];
    }
    
    return {
      averageRed: totalR / pixelCount,
      averageGreen: totalG / pixelCount,
      averageBlue: totalB / pixelCount,
      colorfulness: this.calculateColorfulness(pixels)
    };
  }

  /**
   * Calcula brilho médio da imagem
   */
  calculateBrightness(pixels) {
    let total = 0;
    const pixelCount = pixels.length / 4;
    
    for (let i = 0; i < pixels.length; i += 4) {
      const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      total += brightness;
    }
    
    return total / pixelCount;
  }

  /**
   * Calcula contraste da imagem
   */
  calculateContrast(pixels) {
    const brightness = this.calculateBrightness(pixels);
    let variance = 0;
    const pixelCount = pixels.length / 4;
    
    for (let i = 0; i < pixels.length; i += 4) {
      const pixelBrightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      variance += Math.pow(pixelBrightness - brightness, 2);
    }
    
    return Math.sqrt(variance / pixelCount);
  }

  /**
   * Calcula nitidez usando gradiente
   */
  calculateSharpness(imageData) {
    const { data, width, height } = imageData;
    let sharpness = 0;
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = (y * width + x) * 4;
        const gx = data[i + 4] - data[i - 4]; // Gradiente horizontal
        const gy = data[i + width * 4] - data[i - width * 4]; // Gradiente vertical
        sharpness += Math.sqrt(gx * gx + gy * gy);
      }
    }
    
    return sharpness / ((width - 2) * (height - 2));
  }

  /**
   * Calcula colorfulness da imagem
   */
  calculateColorfulness(pixels) {
    let rg = 0, yb = 0;
    const pixelCount = pixels.length / 4;
    
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      
      rg += Math.abs(r - g);
      yb += Math.abs(0.5 * (r + g) - b);
    }
    
    return (rg + yb) / pixelCount;
  }

  /**
   * Extrai cores dominantes
   */
  getDominantColors(pixels, numColors = 5) {
    const colorMap = new Map();
    
    // Simplificar cores para reduzir variações
    for (let i = 0; i < pixels.length; i += 16) { // Amostragem
      const r = Math.floor(pixels[i] / 32) * 32;
      const g = Math.floor(pixels[i + 1] / 32) * 32;
      const b = Math.floor(pixels[i + 2] / 32) * 32;
      const color = `${r},${g},${b}`;
      
      colorMap.set(color, (colorMap.get(color) || 0) + 1);
    }
    
    return Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, numColors)
      .map(([color, count]) => {
        const [r, g, b] = color.split(',').map(Number);
        return { rgb: `rgb(${r},${g},${b})`, count, hex: this.rgbToHex(r, g, b) };
      });
  }

  /**
   * Calcula score de qualidade da imagem
   */
  calculateQualityScore(img, pixels) {
    const resolution = img.width * img.height;
    const brightness = this.calculateBrightness(pixels);
    const contrast = this.calculateContrast(pixels);
    const sharpness = this.calculateSharpness({ data: pixels, width: img.width, height: img.height });
    
    // Normalizar scores (0-100)
    const resolutionScore = Math.min(resolution / 2000000 * 100, 100); // 2MP = 100%
    const brightnessScore = 100 - Math.abs(brightness - 128) / 128 * 100; // Ideal ~128
    const contrastScore = Math.min(contrast / 50 * 100, 100); // Contraste ideal
    const sharpnessScore = Math.min(sharpness / 10 * 100, 100);
    
    return {
      overall: (resolutionScore + brightnessScore + contrastScore + sharpnessScore) / 4,
      resolution: resolutionScore,
      brightness: brightnessScore,
      contrast: contrastScore,
      sharpness: sharpnessScore
    };
  }

  /**
   * Compara duas imagens e retorna análise comparativa
   */
  async compareImages(image1Src, image2Src) {
    const [features1, features2] = await Promise.all([
      this.extractFeatures(image1Src),
      this.extractFeatures(image2Src)
    ]);
    
    if (!features1 || !features2) {
      throw new Error('Erro ao processar uma das imagens');
    }
    
    return {
      similarity: this.calculateSimilarity(features1, features2),
      qualityComparison: this.compareQuality(features1, features2),
      colorComparison: this.compareColors(features1, features2),
      dimensionComparison: this.compareDimensions(features1, features2),
      features: { image1: features1, image2: features2 }
    };
  }

  /**
   * Calcula similaridade entre duas imagens
   */
  calculateSimilarity(features1, features2) {
    const colorSim = this.calculateColorSimilarity(features1.colorAnalysis, features2.colorAnalysis);
    const brightnessSim = 1 - Math.abs(features1.brightness - features2.brightness) / 255;
    const contrastSim = 1 - Math.abs(features1.contrast - features2.contrast) / 100;
    const aspectSim = 1 - Math.abs(features1.dimensions.aspectRatio - features2.dimensions.aspectRatio) / 2;
    
    return {
      overall: (colorSim + brightnessSim + contrastSim + aspectSim) / 4 * 100,
      color: colorSim * 100,
      brightness: brightnessSim * 100,
      contrast: contrastSim * 100,
      aspect: aspectSim * 100
    };
  }

  /**
   * Calcula similaridade de cores
   */
  calculateColorSimilarity(color1, color2) {
    const rDiff = Math.abs(color1.averageRed - color2.averageRed) / 255;
    const gDiff = Math.abs(color1.averageGreen - color2.averageGreen) / 255;
    const bDiff = Math.abs(color1.averageBlue - color2.averageBlue) / 255;
    
    return 1 - (rDiff + gDiff + bDiff) / 3;
  }

  /**
   * Compara qualidade entre imagens
   */
  compareQuality(features1, features2) {
    const q1 = features1.qualityScore;
    const q2 = features2.qualityScore;
    
    return {
      winner: q1.overall > q2.overall ? 'image1' : 'image2',
      difference: Math.abs(q1.overall - q2.overall),
      details: {
        resolution: { image1: q1.resolution, image2: q2.resolution },
        brightness: { image1: q1.brightness, image2: q2.brightness },
        contrast: { image1: q1.contrast, image2: q2.contrast },
        sharpness: { image1: q1.sharpness, image2: q2.sharpness }
      }
    };
  }

  /**
   * Compara cores entre imagens
   */
  compareColors(features1, features2) {
    return {
      similarity: this.calculateColorSimilarity(features1.colorAnalysis, features2.colorAnalysis) * 100,
      dominantColors: {
        image1: features1.dominantColors,
        image2: features2.dominantColors
      },
      colorfulness: {
        image1: features1.colorAnalysis.colorfulness,
        image2: features2.colorAnalysis.colorfulness,
        winner: features1.colorAnalysis.colorfulness > features2.colorAnalysis.colorfulness ? 'image1' : 'image2'
      }
    };
  }

  /**
   * Compara dimensões entre imagens
   */
  compareDimensions(features1, features2) {
    const d1 = features1.dimensions;
    const d2 = features2.dimensions;
    
    return {
      resolution: {
        image1: d1.width * d1.height,
        image2: d2.width * d2.height,
        winner: (d1.width * d1.height) > (d2.width * d2.height) ? 'image1' : 'image2'
      },
      aspectRatio: {
        image1: d1.aspectRatio,
        image2: d2.aspectRatio,
        similarity: 1 - Math.abs(d1.aspectRatio - d2.aspectRatio) / 2
      }
    };
  }

  /**
   * Converte RGB para HEX
   */
  rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  /**
   * Gera relatório de análise para avaliação imobiliária
   */
  generatePropertyAnalysis(webscrapingImages, databaseImages) {
    const analysis = {
      timestamp: new Date().toISOString(),
      webscrapingCount: webscrapingImages.length,
      databaseCount: databaseImages.length,
      comparisons: [],
      summary: {
        averageQuality: { webscraping: 0, database: 0 },
        bestMatches: [],
        qualityWinner: null,
        recommendations: []
      }
    };

    // Análise detalhada será implementada quando as imagens forem comparadas
    return analysis;
  }
}

export default ImageAnalysis;