import { motion, AnimatePresence } from 'framer-motion';
import { Facility } from '../context/FacilitiesContext';
import React, { useState, useEffect, ReactElement } from 'react';

interface RecommendationModalProps {
  recommendations: Facility[];
}

const RecommendationModal: React.FC<RecommendationModalProps> = ({ recommendations }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(true);
  const [loadingFacilityId, setLoadingFacilityId] = useState<string | null>(null);
  const [expandedFacility, setExpandedFacility] = useState<string | null>(null);

  console.log("Recommendations:", recommendations);

  // Show modal 5 seconds after load if recommendations exist
  useEffect(() => {
    if (recommendations?.length > 0) {
      const timer = setTimeout(() => setShowModal(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [recommendations]);

  const handleViewDetails = async (facility: Facility): Promise<void> => {
    setLoadingFacilityId(facility._id);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoadingFacilityId(null);
  };

  const toggleFacilityDetails = (facilityId: string): void => {
    setExpandedFacility(expandedFacility === facilityId ? null : facilityId);
  };

  const getFacilityName = (facility: Facility): string => {
    return facility.provider_name || facility.name || 'Unknown Facility';
  };

  const getFacilityCity = (facility: Facility): string => {
    return facility.city_town || facility.city || 'Unknown City';
  };

  const getFacilityState = (facility: Facility): string => {
    return facility.state || 'Unknown State';
  };

  const getRating = (facility: Facility): number => {
    return facility.numeric_overall_rating || facility.overall_rating || facility.rating || 0;
  };

  const getBedsCount = (facility: Facility): string => {
    return facility.number_of_certified_beds ? `${facility.number_of_certified_beds} beds` : 'N/A';
  };

  const getStatusColor = (status: string | undefined): string => {
    switch (status) {
      case 'Accepting': return 'text-green-600 bg-green-100';
      case 'Waitlist': return 'text-yellow-600 bg-yellow-100';
      case 'Full': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderStars = (rating: number): ReactElement[] => {
    const stars: ReactElement[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-red-500">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="text-red-500">½</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }
    return stars;
  };

  const renderTags = (facility: Facility): ReactElement | null => {
    const tags: string[] = [];
    
    const rating = getRating(facility);
    if (rating >= 4) {
      tags.push("⭐ Top Rated");
    } else if (rating >= 3) {
      tags.push("👍 Good Quality");
    }

    if (facility.number_of_certified_beds && facility.number_of_certified_beds > 100) {
      tags.push("🏢 Large Facility");
    }

    if (facility.ownership_type) {
      tags.push(`🏛️ ${facility.ownership_type}`);
    }

    if (facility.status) {
      tags.push(`📊 ${facility.status}`);
    }

    if (facility.distance_km && facility.distance_km < 5) {
      tags.push("📍 Nearby");
    }

    if (!tags.length) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {tag}
          </span>
        ))}
      </div>
    );
  };

  const formatPhoneNumber = (phone: string | undefined): string => {
    if (!phone) return 'N/A';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const formatDistance = (distance: number | null | undefined): string => {
    if (!distance) return 'N/A';
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  return (
    <AnimatePresence>
      {showModal && recommendations?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 200, y: -100 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 200, y: -100 }}
          transition={{ type: "spring", stiffness: 80, damping: 12 }}
          className="fixed top-6 right-6 z-50 bg-white shadow-2xl border border-gray-200 rounded-2xl w-80 max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                🌟 Top Recommendations
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {recommendations.length} facilities found
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setExpanded((prev) => !prev)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition"
                title={expanded ? "Collapse" : "Expand"}
                aria-label={expanded ? "Collapse recommendations" : "Expand recommendations"}
              >
                {expanded ? "▲" : "▼"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
                title="Close"
                aria-label="Close recommendations"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Subheading */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Based on your search and preferences:
            </p>
          </div>

          {/* Collapsible content */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-hidden"
              >
                <div className="space-y-3 p-4 max-h-96 overflow-y-auto">
                  {recommendations.slice(0, 6).map((facility, index) => (
                    <motion.div
                      key={facility._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-all bg-white"
                    >
                      {/* Facility Header - Clickable for toggle */}
                      <div 
                        className="flex justify-between items-start gap-2 cursor-pointer"
                        onClick={() => toggleFacilityDetails(facility._id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleFacilityDetails(facility._id);
                          }
                        }}
                        aria-expanded={expandedFacility === facility._id}
                        aria-controls={`facility-details-${facility._id}`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate">
                            {getFacilityName(facility)}
                          </p>
                          <p className="text-sm text-gray-600 truncate mt-1">
                            {getFacilityCity(facility)}, {getFacilityState(facility)}
                          </p>
                          {facility.legal_business_name && facility.legal_business_name !== getFacilityName(facility) && (
                            <p className="text-xs text-gray-500 truncate mt-1">
                              {facility.legal_business_name}
                            </p>
                          )}
                        </div>
                        
                        {/* Rating with Red Stars */}
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1">
                            {renderStars(getRating(facility))}
                            <span className="ml-1 text-sm font-semibold text-gray-700">
                              {getRating(facility).toFixed(1)}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFacilityDetails(facility._id);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 transition"
                            aria-label={expandedFacility === facility._id ? "Show less details" : "Show more details"}
                          >
                            {expandedFacility === facility._id ? "Less" : "More"}
                          </button>
                        </div>
                      </div>

                      {/* Tags */}
                      {renderTags(facility)}

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {expandedFacility === facility._id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 pt-3 border-t border-gray-100"
                            id={`facility-details-${facility._id}`}
                          >
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-gray-600">Beds</p>
                                <p className="font-semibold text-gray-800">
                                  {getBedsCount(facility)}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">Ownership</p>
                                <p className="font-semibold text-gray-800">
                                  {facility.ownership_type || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">Distance</p>
                                <p className="font-semibold text-gray-800">
                                  {formatDistance(facility.distance_km)}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">Status</p>
                                <p className={`font-semibold px-2 py-1 rounded-full text-xs ${getStatusColor(facility.status)}`}>
                                  {facility.status || 'Unknown'}
                                </p>
                              </div>
                            </div>

                            {facility.provider_address && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-600">Address</p>
                                <p className="text-sm text-gray-800 truncate">
                                  {facility.provider_address}
                                </p>
                              </div>
                            )}

                            {facility.telephone_number && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-600">Phone</p>
                                <p className="text-sm text-gray-800">
                                  {formatPhoneNumber(facility.telephone_number)}
                                </p>
                              </div>
                            )}

                            {/* AI Summary Preview */}
                            {facility.aiSummary?.summary && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-600">AI Summary</p>
                                <p className="text-sm text-gray-800 line-clamp-2">
                                  {facility.aiSummary.summary}
                                </p>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => handleViewDetails(facility)}
                                disabled={loadingFacilityId === facility._id}
                                className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                              >
                                {loadingFacilityId === facility._id ? (
                                  <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Loading...
                                  </span>
                                ) : (
                                  "View Full Details"
                                )}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Show message when collapsed */}
          {!expanded && (
            <div className="p-6 text-center text-gray-500">
              <div className="text-2xl mb-2">📋</div>
              <p className="text-sm font-medium">Recommendations Available</p>
              <p className="text-xs mt-1">Click the arrow ↓ to view {recommendations.length} facilities</p>
            </div>
          )}

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              Showing {Math.min(recommendations.length, 6)} of {recommendations.length} recommendations
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RecommendationModal;