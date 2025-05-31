// JAY Real Estate Data Models
// Inspired by fam Properties structure and Dubai real estate market

// Enhanced Property Model with Dubai-specific features
class PropertyModel {
  constructor(data) {
    // Basic Information
    this.id = data.id;
    this.title = data.title;
    this.price = data.price;
    this.currency = data.currency || 'AED';
    this.pricePerSqft = data.pricePerSqft;
    
    // Property Details
    this.type = data.type; // apartment, villa, townhouse, office, plot, penthouse
    this.transactionType = data.transactionType; // buy, rent, off-plan
    this.bedrooms = data.bedrooms;
    this.bathrooms = data.bathrooms;
    this.area = data.area;
    this.areaUnit = data.areaUnit || 'sqft';
    
    // Location & Development
    this.location = data.location;
    this.community = data.community;
    this.building = data.building;
    this.developer = data.developer;
    this.projectName = data.projectName;
    
    // Features & Amenities
    this.features = data.features || [];
    this.images = data.images || [];
    this.description = data.description;
    this.amenities = data.amenities || [];
    
    // Financial & Timeline
    this.paymentPlan = data.paymentPlan;
    this.completionDate = data.completionDate;
    this.handoverDate = data.handoverDate;
    this.serviceCharge = data.serviceCharge;
    
    // Property Characteristics
    this.furnished = data.furnished || false;
    this.luxury = data.luxury || false;
    this.beachfront = data.beachfront || false;
    this.waterfront = data.waterfront || false;
    this.golfCourse = data.golfCourse || false;
    this.status = data.status; // ready, under-construction, off-plan, sold
    
    // Additional Dubai-specific features
    this.dldNumber = data.dldNumber; // Dubai Land Department registration
    this.reraNumber = data.reraNumber; // Real Estate Regulatory Agency
    this.parking = data.parking || 0;
    this.balcony = data.balcony || false;
    this.maidRoom = data.maidRoom || false;
    this.studyRoom = data.studyRoom || false;
    this.laundryRoom = data.laundryRoom || false;
    
    // Investment Information
    this.roi = data.roi; // Return on Investment
    this.rentalYield = data.rentalYield;
    this.appreciation = data.appreciation;
    
    // Contact & Listing
    this.agent = data.agent;
    this.listedDate = data.listedDate;
    this.lastUpdated = data.lastUpdated;
    this.views = data.views || 0;
    this.inquiries = data.inquiries || 0;
  }

  // Utility Methods
  getFormattedPrice() {
    return `${this.currency} ${this.price.toLocaleString()}`;
  }

  getPropertyDetails() {
    let details = `${this.bedrooms} Beds | ${this.bathrooms} Baths | ${this.area.toLocaleString()} ${this.areaUnit}`;
    if (this.parking > 0) details += ` | ${this.parking} Parking`;
    return details;
  }

  getPricePerSqft() {
    return this.pricePerSqft || Math.round(this.price / this.area);
  }

  getPropertyTags() {
    const tags = [];
    if (this.luxury) tags.push('Luxury');
    if (this.furnished) tags.push('Furnished');
    if (this.beachfront) tags.push('Beachfront');
    if (this.waterfront) tags.push('Waterfront');
    if (this.golfCourse) tags.push('Golf Course');
    if (this.maidRoom) tags.push("Maid's Room");
    if (this.studyRoom) tags.push('Study Room');
    return tags;
  }

  isNewProject() {
    return this.status === 'off-plan' || this.status === 'under-construction';
  }
}

// Location/Community Model for Dubai areas
class LocationModel {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type; // community, district, landmark, island
    this.description = data.description;
    this.zone = data.zone; // Dubai zones (1-4)
    
    // Pricing Information
    this.averagePrice = data.averagePrice;
    this.priceRange = data.priceRange;
    this.popularPropertyTypes = data.popularPropertyTypes || [];
    
    // Location Features
    this.amenities = data.amenities || [];
    this.nearbyLandmarks = data.nearbyLandmarks || [];
    this.transportation = data.transportation || [];
    this.schools = data.schools || [];
    this.hospitals = data.hospitals || [];
    this.shoppingCenters = data.shoppingCenters || [];
    
    // Geographic Information
    this.coordinates = data.coordinates;
    this.distanceToAirport = data.distanceToAirport;
    this.distanceToDowntown = data.distanceToDowntown;
    this.distanceToBeach = data.distanceToBeach;
    
    // Investment Metrics
    this.investmentRating = data.investmentRating;
    this.rentalDemand = data.rentalDemand;
    this.futureProjects = data.futureProjects || [];
  }

  getLocationScore() {
    // Calculate location score based on amenities, transportation, etc.
    let score = 0;
    score += this.amenities.length * 2;
    score += this.transportation.length * 3;
    score += this.schools.length * 2;
    score += this.investmentRating || 0;
    return Math.min(score, 100);
  }
}

// Developer Model for Dubai developers
class DeveloperModel {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.logo = data.logo;
    this.description = data.description;
    this.established = data.established;
    this.website = data.website;
    
    // Portfolio Information
    this.projects = data.projects || [];
    this.completedProjects = data.completedProjects || [];
    this.upcomingProjects = data.upcomingProjects || [];
    this.totalUnits = data.totalUnits || 0;
    
    // Reputation & Ratings
    this.rating = data.rating;
    this.reviews = data.reviews || [];
    this.awards = data.awards || [];
    
    // Specializations
    this.specializations = data.specializations || []; // luxury, affordable, commercial, etc.
    this.popularLocations = data.popularLocations || [];
    
    // Contact Information
    this.contactInfo = data.contactInfo;
    this.headquarters = data.headquarters;
  }

  getCompletionRate() {
    const total = this.projects.length;
    const completed = this.completedProjects.length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }
}

// Agent/Broker Model
class AgentModel {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.photo = data.photo;
    this.title = data.title;
    this.experience = data.experience;
    this.languages = data.languages || [];
    this.specializations = data.specializations || [];
    this.locations = data.locations || [];
    
    // Contact Information
    this.phone = data.phone;
    this.email = data.email;
    this.whatsapp = data.whatsapp;
    
    // Performance Metrics
    this.rating = data.rating;
    this.reviews = data.reviews || [];
    this.propertiesSold = data.propertiesSold || 0;
    this.propertiesRented = data.propertiesRented || 0;
    this.clientSatisfaction = data.clientSatisfaction;
    
    // Certifications
    this.reraLicense = data.reraLicense;
    this.certifications = data.certifications || [];
  }

  getTotalTransactions() {
    return this.propertiesSold + this.propertiesRented;
  }
}

// Search Filter Model
class SearchFilterModel {
  constructor() {
    this.type = null; // apartment, villa, etc.
    this.transactionType = null; // buy, rent
    this.location = null;
    this.community = null;
    this.developer = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.bedrooms = null;
    this.bathrooms = null;
    this.minArea = null;
    this.maxArea = null;
    this.furnished = null;
    this.luxury = null;
    this.beachfront = null;
    this.status = null;
    this.paymentPlan = null;
    this.completionDate = null;
    this.amenities = [];
    this.features = [];
  }

  reset() {
    Object.keys(this).forEach(key => {
      if (Array.isArray(this[key])) {
        this[key] = [];
      } else {
        this[key] = null;
      }
    });
  }

  hasActiveFilters() {
    return Object.values(this).some(value => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== null;
    });
  }
}

// Export models for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PropertyModel,
    LocationModel,
    DeveloperModel,
    AgentModel,
    SearchFilterModel
  };
}
