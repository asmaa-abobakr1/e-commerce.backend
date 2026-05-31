const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Youth Store' },
  heroBadge: { type: String, default: 'NEW COLLECTION 2026' },
  heroTitle: { type: String, default: 'STYLE THAT' },
  heroTitlePart2: { type: String, default: 'DEFINES YOU' },
  heroSubtitle: { type: String, default: 'Experience the ultimate fusion of comfort and street style with YouthStore\'s exclusive drops.' },
  heroImage: { type: String },
  shopBtnText: { type: String, default: 'Shop Collection' },
  lookbookBtnText: { type: String, default: 'View Lookbook' },
  qualityCardText: { type: String, default: 'Premium Quality' },
  
  newArrivalsTitle: { type: String, default: 'New Arrivals' },
  newArrivalsSubTitle: { type: String, default: 'The Latest' },
  
  bestSellersTitle: { type: String, default: 'Best Sellers' },
  bestSellersSubTitle: { type: String, default: 'Popular Choice' },
  
  testimonialsTitle: { type: String, default: 'What They Say' },
  testimonialsSubTitle: { type: String, default: 'Community' },
  
  contactTitle: { type: String, default: 'Get in Touch' },
  contactSubTitle: { type: String, default: 'Have questions? We\'re here to help (or just to chat about fashion).' },
  contactEmail: { type: String, default: 'hello@youthstore.com' },
  phone: { type: String, default: '+20 123 456 7890' },
  address: { type: String, default: '123 Fashion St, Cairo, Egypt' },
  googleMapUrl: { type: String, default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.663185368!2d31.233333!3d30.033333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzAwLjAiTiAzMcKwMTQnMDAuMCJF!5e0!3m2!1sen!2seg!4v1620000000000!5m2!1sen!2seg' },
  
  footerAboutText: { type: String, default: 'The ultimate destination for casual youth fashion. Stay trendy, stay vibrant with our latest collections and exclusive street style drops.' },
  
  socialLinks: {
    facebook: { type: String, default: '#' },
    instagram: { type: String, default: '#' },
    twitter: { type: String, default: '#' }
  },
  marketingImages: [{ type: String }]
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);
module.exports = Settings;
