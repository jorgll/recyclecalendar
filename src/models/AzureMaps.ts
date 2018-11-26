// Azure Maps API
// From https://docs.microsoft.com/en-us/rest/api/maps/search/getsearchaddress

export interface SearchAddressResponse {
  summary: SearchAddressSummary
  results: SearchAddressResult[]
}

export interface SearchAddressSummary {
  fuzzyLevel: number
  numResults: number
  offset: number
  query: string
  queryTime: number
  queryType: string
  totalResults: number
}

export interface SearchAddressResult {
  address: SearchResultAddress
  dataSources: DataSources
  entryPoints: SearchResultEntryPoint[]
  id: string
  position: CoordinateAbbreviated
  score: number
  type: string
  viewport: SearchResultViewport
}

export interface SearchResultAddress {
  buildingNumber: string
  country: string
  countryCode: string
  countryCodeISO3: string
  countrySecondarySubdivision: string
  countrySubdivision: string
  countrySubdivisionName: string
  countryTertiarySubdivision: string
  crossStreet: string
  extendedPostalCode: string
  freeformAddress: string
  municipality: string
  municipalitySubdivision: string
  postalCode: string
  routeNumbers: number[]
  street: string
  streetName: string
  streetNameAndNumber: string
  streetNumber: string
}

export interface DataSources {
  geometry: DataSourcesGeometry
}

export interface DataSourcesGeometry {
  id: string
}

enum SearchResultEntryPointType {
  main,
  minor,
}

export interface SearchResultEntryPoint {
  position: CoordinateAbbreviated
  type: SearchResultEntryPointType
}

export interface SearchResultViewport {
  btmRightPoint: CoordinateAbbreviated
  topLeftPoint: CoordinateAbbreviated
}

export interface CoordinateAbbreviated {
  lat: number
  lon: number
}
