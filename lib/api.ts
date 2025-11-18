// export const apiService = new ApiService();
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('adminToken');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        // ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Construct the full URL - endpoint already includes /api
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log('Making API request to:', fullUrl); // Debug log

    const response = await fetch(fullUrl, config);

    // const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Auth APIs
  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Transform response to match frontend expected format
    return {
      token: response.token,
      user: {
        id: response.user?.id,
        name: response.user?.name,
        email: response.user?.email,
        role: response.user?.role
      }
    };
  }

  async setupAdmin(name: string, email: string, password: string) {
    return this.request('/auth/setup-admin', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  // Blog APIs
  async getBlogs(page = 1, limit = 10, status?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });
    return this.request(`/blogs/admin/all?${params}`);
  }

  async createBlog(blogData: any) {
    return this.request('/blogs', {
      method: 'POST',
      body: JSON.stringify(blogData),
    });
  }

  async updateBlog(id: string, blogData: any) {
    return this.request(`/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(blogData),
    });
  }

  async deleteBlog(id: string) {
    return this.request(`/blogs/${id}`, {
      method: 'DELETE',
    });
  }

  // News APIs
  async getNews(page = 1, limit = 10, status?: string, category?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
      ...(category && { category }),
    });
    return this.request(`/news/admin/all?${params}`);
  }

  async createNews(newsData: any) {
    return this.request('/news', {
      method: 'POST',
      body: JSON.stringify(newsData),
    });
  }

  async updateNews(id: string, newsData: any) {
    return this.request(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(newsData),
    });
  }

  async deleteNews(id: string) {
    return this.request(`/news/${id}`, {
      method: 'DELETE',
    });
  }

  // Dashboard APIs
  async getDashboardStats() {
    return this.request('/admin/dashboard');
  }

  // Sponsored Facilities APIs
  async submitSponsorship(formData: any) {
    return this.request('/sponsored/sponsor-facility', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  // async getSponsoredFacilities(page = 1, limit = 10, status?: string) {
  //   const params = new URLSearchParams({
  //     page: page.toString(),
  //     limit: limit.toString(),
  //     ...(status && { status }),
  //   });
  //   return this.request(`/sponsored/admin/all?${params}`);
  // }

  // async approveSponsorship(facilityId: string, durationDays: number = 30) {
  //   return this.request('/sponsored/approve-sponsorship', {
  //     method: 'POST',
  //     body: JSON.stringify({ facilityId, durationDays }),
  //   });
  // }

  // Facilities search for autocomplete
  async searchFacilities(query: string) {
    const params = new URLSearchParams({ q: query });
    return this.request(`/facilities/search?${params}`);
  }


  // Add these methods to your existing ApiService class

  // Sponsored Facilities APIs
  async getSponsoredFacilities(page = 1, limit = 10, status?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });
    return this.request(`/admin/sponsored-facilities?${params}`);
  }

  async createSponsoredFacility(sponsorshipData: any) {
    return this.request('/admin/sponsored-facilities', {
      method: 'POST',
      body: JSON.stringify(sponsorshipData),
    });
  }

  async updateSponsoredFacility(id: string, sponsorshipData: any) {
    return this.request(`/admin/sponsored-facilities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sponsorshipData),
    });
  }

  async deleteSponsoredFacility(id: string) {
    return this.request(`/admin/sponsored-facilities/${id}`, {
      method: 'DELETE',
    });
  }

  async approveSponsorship(facilityId: string, durationDays: number = 30) {
    return this.request(`/admin/sponsored-facilities/${facilityId}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive: true, durationDays }),
    });
  }

  // For the deactivation functionality (if needed separately)
  async deactivateSponsorship(facilityId: string) {
    return this.request(`/admin/sponsored-facilities/${facilityId}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive: false }),
    });
  }

}

export const apiService = new ApiService();