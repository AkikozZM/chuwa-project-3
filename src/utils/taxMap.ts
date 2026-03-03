/**
 * Compute Tax based on the current user's city
 * Only available if user is living in California
 * @param total Total amount of charge
 * @param city Current user's city
 * @returns Tax fee
 */
export function computeTax(total: number, city: string): number {
  const taxRate = cityTaxMap.get(city) || 0;
  return Number((total * taxRate).toFixed(2));
}

/**
 * Hard code all the cities sale tax rate in California
 */
export const cityTaxMap: Map<string, number> = new Map<string, number>([
  ["Los Angeles", 0.095],
  ["San Francisco", 0.085],
  ["San Diego", 0.0775],
  ["San Jose", 0.0925],
  ["Fresno", 0.0825],
  ["Sacramento", 0.085],
  ["Long Beach", 0.1025],
  ["Oakland", 0.1025],
  ["Bakersfield", 0.085],
  ["Anaheim", 0.0775],
  ["Santa Ana", 0.0775],
  ["Riverside", 0.0875],
  ["Stockton", 0.0975],
  ["Irvine", 0.0775],
  ["Chula Vista", 0.0775],
  ["Fremont", 0.0975],
  ["San Bernardino", 0.0875],
  ["Modesto", 0.0875],
  ["Fontana", 0.0875],
  ["Oxnard", 0.0875],
  ["Moreno Valley", 0.0875],
  ["Glendale", 0.1025],
  ["Huntington Beach", 0.0775],
  ["Santa Clarita", 0.1025],
  ["Garden Grove", 0.0775],
  ["Oceanside", 0.0775],
  ["Rancho Cucamonga", 0.0875],
  ["Ontario", 0.0875],
  ["Elk Grove", 0.085],
  ["Corona", 0.0875],
  ["Lancaster", 0.1025],
  ["Palmdale", 0.1025],
  ["Hayward", 0.1025],
  ["Salinas", 0.095],
  ["Pomona", 0.1025],
  ["Sunnyvale", 0.0925],
  ["Escondido", 0.0775],
  ["Torrance", 0.1025],
  ["Pasadena", 0.1025],
  ["Fullerton", 0.0775],
  ["Orange", 0.0775],
  ["Roseville", 0.085],
  ["Visalia", 0.0875],
  ["Concord", 0.1025],
  ["Santa Rosa", 0.0925],
  ["Vallejo", 0.0925],
  ["Victorville", 0.0775],
  ["Bellevue", 0.102],
]);
