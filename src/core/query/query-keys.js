export const queryKeys = {
  clientRequests: ["requests", "client"],
  professionalRequests: ["requests", "professional"],
  professionalOffers: ["offers", "professional"],
  notifications: ["notifications"],
  userProfile: ["profile", "user"],
  professionalProfile: ["profile", "professional"],
  providerJobs: (status) => ["jobs", "provider", status],
  providerReviews: (providerId) => ["reviews", "provider", providerId],
  publicationOffers: (publicationId) => ["offers", "publication", publicationId],
  publicationReview: (publicationId) => ["reviews", "publication", publicationId],
};
