"use client";
import { useState, useEffect, useRef } from "react";
import { X, Star, Building2, Phone, Mail, MapPin, User, ChevronDown, Check } from "lucide-react";
import { apiService } from "@/lib/api";

interface SponsoredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Removed isAuthenticated prop since it's no longer needed
}

interface Facility {
  _id: string;
  provider_name: string;
  city_town: string;
  state: string;
  zip_code: string;
  provider_address?: string;
}

export default function SponsoredModal({ open, onOpenChange }: SponsoredModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    facilityName: "",
    location: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [isLoadingFacilities, setIsLoadingFacilities] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Get API URL from environment variable
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Load all facilities when modal opens
  useEffect(() => {
    if (open) {
      loadAllFacilities();
    }
  }, [open]);

  // Close dropdown when clicking outside of dropdown (but not outside modal)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only close dropdown if clicking outside of dropdown AND input
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent modal close when clicking inside modal content
  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (
        modalRef.current && 
        !modalRef.current.contains(event.target as Node)
      ) {
        // Don't close modal when clicking outside - only close via close button
        return;
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutsideModal);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    };
  }, [open]);

  // Load all facilities from API (only called when modal opens)
  const loadAllFacilities = async () => {
    setIsLoadingFacilities(true);
    try {
      const response = await fetch(`${API_URL}/facilities/all`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFacilities(data.facilities || []);
          setFilteredFacilities(data.facilities || []);
          console.log(`Loaded ${data.facilities?.length} facilities`);
        }
      } else {
        console.error("Failed to load facilities");
        setError("Failed to load facilities. Please try again.");
      }
    } catch (error) {
      console.error("Error loading facilities:", error);
      setError("Error loading facilities. Please try again.");
    } finally {
      setIsLoadingFacilities(false);
      setSearchLoading(false);
    }
  };

  // Filter facilities based on search input with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (formData.facilityName.length > 0) {
        // Filter locally from already loaded facilities
        const filtered = facilities.filter(facility =>
          facility.provider_name?.toLowerCase().includes(formData.facilityName.toLowerCase()) ||
          facility.city_town?.toLowerCase().includes(formData.facilityName.toLowerCase()) ||
          facility.zip_code?.includes(formData.facilityName)
        );
        setFilteredFacilities(filtered);
      } else {
        setFilteredFacilities(facilities);
      }
    }, 200);

    return () => clearTimeout(debounceTimer);
  }, [formData.facilityName, facilities]);

  // Select a facility from dropdown
  const selectFacility = (facility: Facility) => {
    setSelectedFacility(facility);
    setFormData({
      ...formData,
      facilityName: facility.provider_name || "",
      location: `${facility.city_town}, ${facility.state} ${facility.zip_code}`
    });
    setShowDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log('🔄 Starting form submission...');
    console.log('📝 Form data:', formData);
    console.log('🏥 Selected facility:', selectedFacility);

    // Validate facility selection
    if (!selectedFacility) {
        const errorMsg = "Please select a facility from the dropdown list.";
        console.error('❌ Validation failed:', errorMsg);
        setError(errorMsg);
        setLoading(false);
        return;
    }

    try {
        const submissionData = {
        ...formData,
        facilityId: selectedFacility._id
        };

        console.log('📤 Submitting to API:', submissionData);
        
        const result = await apiService.submitSponsorship(submissionData);
        
        console.log('✅ API response:', result);

        setSubmitted(true);
        setFormData({
        name: "",
        email: "",
        phone: "",
        facilityName: "",
        location: "",
        message: "",
        });
        setSelectedFacility(null);
        setFilteredFacilities(facilities);
        
    } catch (error: any) {
        console.error("❌ Error submitting form:", error);
        console.error("❌ Error details:", {
        message: error.message,
        stack: error.stack
        });
        setError(error.message || 'Failed to submit sponsorship request. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "facilityName") {
      setFormData(prev => ({
        ...prev,
        facilityName: value,
        location: "" // Reset location when facility name changes
      }));
      setSelectedFacility(null);
      setShowDropdown(true);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form when closing
    setTimeout(() => {
      setSubmitted(false);
      setError("");
      setFormData({
        name: "",
        email: "",
        phone: "",
        facilityName: "",
        location: "",
        message: "",
      });
      setSelectedFacility(null);
      setFacilities([]);
      setFilteredFacilities([]);
      setShowDropdown(false);
    }, 300);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred Background - Non-clickable */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-md" />
      
      {/* Modal Content */}
      <div 
        ref={modalRef}
        className="relative bg-white rounded-2xl w-full max-w-md mx-4 sm:max-w-lg shadow-xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Sponsored Facility</h2>
              <p className="text-gray-600 text-sm">Get your facility featured</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Thank You!
              </h3>
              <p className="text-gray-600 mb-4">
                Your sponsorship request has been submitted successfully.
              </p>
              <p className="text-sm text-gray-500 mb-2">
                We've sent a confirmation email to <strong>{formData.email}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Our team will contact you within 24 hours to discuss the sponsorship details.
              </p>
              <button
                onClick={handleClose}
                className="mt-6 bg-[#C71F37] text-white px-6 py-2 rounded-lg hover:bg-[#a51a2f] transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Loading State for Facilities */}
              {isLoadingFacilities && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-blue-700 text-sm">Loading facilities...</span>
                  </div>
                </div>
              )}

              {/* Benefits */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                <h4 className="font-semibold text-amber-800 mb-2">Sponsorship Benefits:</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Featured placement on homepage</li>
                  <li>• Priority in search results</li>
                  <li>• Enhanced facility profile</li>
                  <li>• Show on top in your city/state</li>
                </ul>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C71F37] focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C71F37] focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C71F37] focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* Facility Name with Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facility Name *
                    {selectedFacility && (
                      <span className="ml-2 text-green-600 text-xs">
                        ✓ Selected
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      ref={inputRef}
                      type="text"
                      name="facilityName"
                      required
                      value={formData.facilityName}
                      onChange={handleChange}
                      onFocus={() => !isLoadingFacilities && setShowDropdown(true)}
                      disabled={isLoadingFacilities}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C71F37] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder={isLoadingFacilities ? "Loading facilities..." : "Search for your facility..."}
                    />
                    <button
                      type="button"
                      onClick={() => !isLoadingFacilities && setShowDropdown(!showDropdown)}
                      disabled={isLoadingFacilities}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {searchLoading && (
                      <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#C71F37]"></div>
                      </div>
                    )}
                  </div>

                  {/* Facilities Dropdown */}
                  {showDropdown && !isLoadingFacilities && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredFacilities.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                          No facilities found. Try a different search term.
                        </div>
                      ) : (
                        <>
                          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                            <p className="text-xs text-gray-600">
                              Showing {filteredFacilities.length} facilities
                            </p>
                          </div>
                          {filteredFacilities.map((facility) => (
                            <button
                              key={facility._id}
                              type="button"
                              onClick={() => selectFacility(facility)}
                              className={`w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                                selectedFacility?._id === facility._id ? 'bg-blue-50 border-blue-200' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="font-medium text-gray-900 truncate">
                                  {facility.provider_name}
                                </div>
                                {selectedFacility?._id === facility._id && (
                                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 ml-2" />
                                )}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {facility.city_town}, {facility.state} {facility.zip_code}
                              </div>
                              {facility.provider_address && (
                                <div className="text-xs text-gray-500 mt-1 truncate">
                                  {facility.provider_address}
                                </div>
                              )}
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Location (auto-filled when facility is selected) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facility Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C71F37] focus:border-transparent bg-gray-50"
                      placeholder="Location will auto-fill when you select a facility"
                      readOnly={!!selectedFacility}
                    />
                    {selectedFacility && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                    )}
                  </div>
                  {!selectedFacility && (
                    <p className="text-xs text-gray-500 mt-1">
                      Select a facility above to auto-fill the location
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Message
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C71F37] focus:border-transparent"
                    placeholder="Tell us about your facility and sponsorship needs..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading || !selectedFacility || isLoadingFacilities}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-lg hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </span>
                  ) : (
                    "Submit for Sponsorship"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>

              {/* Privacy Notice */}
              <p className="text-xs text-gray-500 text-center pt-4">
                By submitting this form, you agree to our terms and privacy policy. 
                We will contact you within 24 hours to discuss sponsorship details.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}