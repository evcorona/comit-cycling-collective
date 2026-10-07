export const QR_LIMITS = {
  1: {
    version: 1,
    modules: 21,
    maxBytesM: 14,
    recommendedBytes: 12,
    maxAlphanumericM: 20,
    maxNumericM: 34,
  },
  2: {
    version: 6,
    modules: 41,
    maxBytesM: 106,
    recommendedBytes: 95,
    maxAlphanumericM: 154,
    maxNumericM: 255,
  },
  3: {
    version: 12,
    modules: 65,
    maxBytesM: 287,
    recommendedBytes: 260,
    maxAlphanumericM: 419,
    maxNumericM: 691,
  },
  4: {
    version: 18,
    modules: 89,
    maxBytesM: 560,
    recommendedBytes: 510,
    maxAlphanumericM: 816,
    maxNumericM: 1346,
  },
  5: {
    version: 25,
    modules: 117,
    maxBytesM: 997,
    recommendedBytes: 920,
    maxAlphanumericM: 1451,
    maxNumericM: 2395,
  },
  6: {
    version: 31,
    modules: 141,
    maxBytesM: 1452,
    recommendedBytes: 1350,
    maxAlphanumericM: 2113,
    maxNumericM: 3486,
  },
}
export const QR_PHYSICAL_SIZES = Object.keys(QR_LIMITS).map(Number)
export const QR_DEFAULT_LEVEL = 'M'
export const QR_LEVELS = ['L', 'M', 'Q', 'H']
export const QR_MARGIN_MODULES = 4
export const QR_MIN_MODULE_MM = 0.4
export const QR_PREVIEW_SIZE = 208
export const QR_VERSION_BASE_MODULES = 17
export const QR_VERSION_MODULE_STEP = 4
export const QR_ALPHANUMERIC_REGEX = /^[0-9A-Z $%*+\-./:]*$/

export const QR_MAX_CAPACITY = {
  byte: { L: 2953, M: 2331, Q: 1663, H: 1273 },
  alphanumeric: { L: 4296, M: 3391, Q: 2420, H: 1852 },
  numeric: { L: 7089, M: 5596, Q: 3993, H: 3057 },
}
export const QR_RENDER_OPTIONS = {
  xmlns: 'http://www.w3.org/2000/svg',
  boostLevel: false,
  marginSize: QR_MARGIN_MODULES,
  bgColor: '#FFFFFF',
  fgColor: '#000000',
}
