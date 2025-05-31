// Property Management System for JAY Real Estate
// Advanced filtering, search, and data management inspired by fam Properties

class PropertyManager {
  constructor(properties = [], locations = [], developers = [], agents = []) {
    this.properties = properties;
    this.locations = locations;
    this.developers = developers;
    this.agents = agents;
    this.searchHistory = [];
    this.favorites = [];
    this.recentlyViewed = [];
  }

  // Property Search and Filtering
  searchProperties(query, filters = {}) {
    let results = this.properties;

    // Text search
    if (query && query.trim()) {
      const searchTerm = query.toLowerCase();
      results = results.filter(property => 
        property.title.toLowerCase().includes(searchTerm) ||
        property.location.toLowerCase().includes(searchTerm) ||
        property.community.toLowerCase().includes(searchTerm) ||
        property.developer.toLowerCase().includes(searchTerm) ||
        property.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply filters
    results = this.applyFilters(results, filters);

    // Save search to history
    this.addToSearchHistory(query, filters, results.length);

    return results;
  }

  applyFilters(properties, filters) {
    return properties.filter(property => {
      // Property type filter
      if (filters.type && property.type !== filters.type) return false;
      
      // Transaction type filter
      if (filters.transactionType && property.transactionType !== filters.transactionType) return false;
      
      // Location filters
      if (filters.location && property.location !== filters.location) return false;
      if (filters.community && property.community !== filters.community) return false;
      
      // Developer filter
      if (filters.developer && property.developer !== filters.developer) return false;
      
      // Price range filters
      if (filters.minPrice && property.price < filters.minPrice) return false;
      if (filters.maxPrice && property.price > filters.maxPrice) return false;
      
      // Bedroom/Bathroom filters
      if (filters.bedrooms && property.bedrooms !== filters.bedrooms) return false;
      if (filters.bathrooms && property.bathrooms !== filters.bathrooms) return false;
      
      // Area filters
      if (filters.minArea && property.area < filters.minArea) return false;
      if (filters.maxArea && property.area > filters.maxArea) return false;
      
      // Feature filters
      if (filters.furnished !== null && property.furnished !== filters.furnished) return false;
      if (filters.luxury !== null && property.luxury !== filters.luxury) return false;
      if (filters.beachfront !== null && property.beachfront !== filters.beachfront) return false;
      if (filters.waterfront !== null && property.waterfront !== filters.waterfront) return false;
      if (filters.golfCourse !== null && property.golfCourse !== filters.golfCourse) return false;
      
      // Status filter
      if (filters.status && property.status !== filters.status) return false;
      
      // Payment plan filter
      if (filters.paymentPlan && property.paymentPlan !== filters.paymentPlan) return false;
      
      // Amenities filter
      if (filters.amenities && filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity => 
          property.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }
      
      // Features filter
      if (filters.features && filters.features.length > 0) {
        const hasAllFeatures = filters.features.every(feature => 
          property.features.includes(feature)
        );
        if (!hasAllFeatures) return false;
      }

      return true;
    });
  }

  // Sorting methods
  sortProperties(properties, sortBy = 'price', order = 'asc') {
    return [...properties].sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case 'price':
          valueA = a.price;
          valueB = b.price;
          break;
        case 'area':
          valueA = a.area;
          valueB = b.area;
          break;
        case 'pricePerSqft':
          valueA = a.getPricePerSqft();
          valueB = b.getPricePerSqft();
          break;
        case 'bedrooms':
          valueA = a.bedrooms;
          valueB = b.bedrooms;
          break;
        case 'listedDate':
          valueA = new Date(a.listedDate);
          valueB = new Date(b.listedDate);
          break;
        case 'views':
          valueA = a.views;
          valueB = b.views;
          break;
        default:
          valueA = a[sortBy];
          valueB = b[sortBy];
      }

      if (order === 'desc') {
        return valueB > valueA ? 1 : valueB < valueA ? -1 : 0;
      } else {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      }
    });
  }

  // Property retrieval methods
  getPropertyById(id) {
    const property = this.properties.find(p => p.id === id);
    if (property) {
      this.addToRecentlyViewed(property);
      property.views = (property.views || 0) + 1;
    }
    return property;
  }

  getFeaturedProperties(limit = 6) {
    return this.properties
      .filter(p => p.luxury || p.beachfront || p.status === 'off-plan')
      .slice(0, limit);
  }

  getPropertiesByLocation(location, limit = null) {
    const results = this.properties.filter(p => p.location === location);
    return limit ? results.slice(0, limit) : results;
  }

  getPropertiesByDeveloper(developer, limit = null) {
    const results = this.properties.filter(p => p.developer === developer);
    return limit ? results.slice(0, limit) : results;
  }

  getNewProjects(limit = null) {
    const results = this.properties.filter(p => 
      p.status === 'off-plan' || p.status === 'under-construction'
    );
    return limit ? results.slice(0, limit) : results;
  }

  getLuxuryProperties(limit = null) {
    const results = this.properties.filter(p => p.luxury);
    return limit ? results.slice(0, limit) : results;
  }

  getBeachfrontProperties(limit = null) {
    const results = this.properties.filter(p => p.beachfront || p.waterfront);
    return limit ? results.slice(0, limit) : results;
  }

  // Investment analysis methods
  getInvestmentAnalysis(propertyId) {
    const property = this.getPropertyById(propertyId);
    if (!property) return null;

    return {
      property: property,
      roi: property.roi,
      rentalYield: property.rentalYield,
      pricePerSqft: property.getPricePerSqft(),
      locationScore: this.getLocationScore(property.location),
      marketTrend: this.getMarketTrend(property.location, property.type),
      recommendation: this.getInvestmentRecommendation(property)
    };
  }

  getLocationScore(locationName) {
    const location = this.locations.find(l => l.name === locationName);
    return location ? location.getLocationScore() : 50;
  }

  getMarketTrend(location, type) {
    // Simplified market trend calculation
    const locationProperties = this.getPropertiesByLocation(location);
    const typeProperties = locationProperties.filter(p => p.type === type);
    
    if (typeProperties.length < 2) return 'stable';
    
    const avgPrice = typeProperties.reduce((sum, p) => sum + p.price, 0) / typeProperties.length;
    const recentProperties = typeProperties.filter(p => 
      new Date(p.listedDate) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    );
    
    if (recentProperties.length === 0) return 'stable';
    
    const recentAvgPrice = recentProperties.reduce((sum, p) => sum + p.price, 0) / recentProperties.length;
    const change = ((recentAvgPrice - avgPrice) / avgPrice) * 100;
    
    if (change > 5) return 'rising';
    if (change < -5) return 'declining';
    return 'stable';
  }

  getInvestmentRecommendation(property) {
    const score = (property.roi || 0) + (property.rentalYield || 0) + this.getLocationScore(property.location) / 10;
    
    if (score > 20) return 'Excellent Investment';
    if (score > 15) return 'Good Investment';
    if (score > 10) return 'Fair Investment';
    return 'Consider Carefully';
  }

  // User interaction methods
  addToFavorites(propertyId) {
    if (!this.favorites.includes(propertyId)) {
      this.favorites.push(propertyId);
    }
  }

  removeFromFavorites(propertyId) {
    this.favorites = this.favorites.filter(id => id !== propertyId);
  }

  getFavoriteProperties() {
    return this.favorites.map(id => this.getPropertyById(id)).filter(Boolean);
  }

  addToRecentlyViewed(property) {
    this.recentlyViewed = this.recentlyViewed.filter(p => p.id !== property.id);
    this.recentlyViewed.unshift(property);
    if (this.recentlyViewed.length > 10) {
      this.recentlyViewed = this.recentlyViewed.slice(0, 10);
    }
  }

  addToSearchHistory(query, filters, resultCount) {
    this.searchHistory.unshift({
      query,
      filters,
      resultCount,
      timestamp: new Date()
    });
    if (this.searchHistory.length > 20) {
      this.searchHistory = this.searchHistory.slice(0, 20);
    }
  }

  // Statistics and analytics
  getMarketStatistics() {
    const totalProperties = this.properties.length;
    const avgPrice = this.properties.reduce((sum, p) => sum + p.price, 0) / totalProperties;
    const priceRanges = this.getPriceRanges();
    const popularLocations = this.getPopularLocations();
    const propertyTypes = this.getPropertyTypeDistribution();

    return {
      totalProperties,
      avgPrice,
      priceRanges,
      popularLocations,
      propertyTypes
    };
  }

  getPriceRanges() {
    const ranges = {
      'Under 1M': 0,
      '1M - 2M': 0,
      '2M - 5M': 0,
      '5M - 10M': 0,
      'Above 10M': 0
    };

    this.properties.forEach(p => {
      if (p.price < 1000000) ranges['Under 1M']++;
      else if (p.price < 2000000) ranges['1M - 2M']++;
      else if (p.price < 5000000) ranges['2M - 5M']++;
      else if (p.price < 10000000) ranges['5M - 10M']++;
      else ranges['Above 10M']++;
    });

    return ranges;
  }

  getPopularLocations() {
    const locationCounts = {};
    this.properties.forEach(p => {
      locationCounts[p.location] = (locationCounts[p.location] || 0) + 1;
    });

    return Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([location, count]) => ({ location, count }));
  }

  getPropertyTypeDistribution() {
    const typeCounts = {};
    this.properties.forEach(p => {
      typeCounts[p.type] = (typeCounts[p.type] || 0) + 1;
    });

    return typeCounts;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PropertyManager;
}
