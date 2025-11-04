"use client"

import * as React from "react";

// Add this new component after HeroSection and before SearchNursing
export function HomepageContent() {
  return (
    <section className="w-full bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* About Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About Carenav</h2>
          <div className="prose prose-lg text-gray-700">
            <p className="mb-4">
              Carenav is your trusted partner in finding the perfect nursing home and care facilities 
              for your loved ones. We understand that choosing the right care facility is one of the 
              most important decisions your family will make, which is why we've created a comprehensive 
              platform that combines official CMS data, real user reviews, and AI-powered insights 
              to guide you through this critical process.
            </p>
            
            <p className="mb-4">
              Our mission is to bring transparency and confidence to healthcare decisions by providing 
              families with accurate, up-to-date information about nursing homes across the United States. 
              We aggregate data from multiple trusted sources including the Centers for Medicare & 
              Medicaid Services (CMS), Google Reviews, and direct facility information to give you 
              a complete picture of each care provider.
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-4">How Carenav Helps Families</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Comprehensive Facility Data:</strong> Access detailed information about staffing ratios, quality measures, health inspections, and overall ratings</li>
              <li><strong>Real User Reviews:</strong> Read authentic experiences from other families who have used these facilities</li>
              <li><strong>AI-Powered Matching:</strong> Our intelligent system helps match your specific needs with the most suitable facilities</li>
              <li><strong>Comparison Tools:</strong> Easily compare multiple facilities side-by-side based on your priorities</li>
              <li><strong>Location-Based Search:</strong> Find quality care options in your desired area with our advanced geolocation features</li>
            </ul>

            <p className="mb-4">
              We believe that every family deserves access to reliable information when making care 
              decisions. That's why our platform is completely free to use - no hidden fees, no 
              registration required for basic searches, and no pressure to choose any particular facility.
            </p>

            <p>
              Whether you're planning for future care needs or facing an urgent situation, Carenav 
              provides the tools and information you need to make informed, confident decisions 
              about nursing home care for your loved ones.
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How Carenav Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Search & Discover</h3>
              <p className="text-gray-600">
                Use our search tool to find nursing homes by location, name, or use your current location to discover nearby options.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Compare & Analyze</h3>
              <p className="text-gray-600">
                Review detailed facility profiles with CMS ratings, user reviews, amenities, and quality metrics.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Make Informed Decisions</h3>
              <p className="text-gray-600">
                Use our comparison tools and expert resources to choose the best facility for your specific needs.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Is Carenav really free to use?</h3>
              <p className="text-gray-600">
                Yes, Carenav is completely free for families searching for nursing homes. We believe access to quality care information should be available to everyone without financial barriers.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">How often is your data updated?</h3>
              <p className="text-gray-600">
                We update our CMS data quarterly and refresh user reviews continuously. Our system automatically checks for updates and incorporates new information as it becomes available.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Can I trust the reviews on your platform?</h3>
              <p className="text-gray-600">
                We aggregate reviews from multiple verified sources including Google Reviews and direct user submissions. All reviews are monitored for authenticity and compliance with our content policies.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Do you cover all states in the US?</h3>
              <p className="text-gray-600">
                Yes, we provide comprehensive coverage of licensed nursing homes and care facilities across all 50 states and US territories.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}