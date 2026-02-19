// app/contact/types.ts
export interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    preferredContact?: 'email' | 'phone' | 'whatsapp';
    tourType?: string;
    travelDates?: {
      start?: string;
      end?: string;
    };
    groupSize?: number;
    budget?: string;
    newsletter?: boolean;
  }
  
  export interface FormErrors {
    [key: string]: string;
  }
  
  export interface OfficeLocation {
    country: string;
    city: string;
    address: string;
    phone: string;
    email: string;
    hours: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    emergency?: string;
    whatsapp?: string;
  }
  
  export interface ContactMethod {
    id: string;
    type: 'email' | 'phone' | 'whatsapp' | 'chat' | 'office';
    label: string;
    value: string;
    icon: string;
    availability: string;
    responseTime: string;
    priority: number;
  }
  
  export interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: 'general' | 'booking' | 'tours' | 'support';
  }
  
  export interface SupportTicket {
    id: string;
    subject: string;
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    createdAt: string;
    updatedAt: string;
    messages: Array<{
      id: string;
      content: string;
      sender: 'user' | 'support';
      timestamp: string;
      attachments?: string[];
    }>;
  }
  
  export interface BusinessHours {
    day: string;
    open: string;
    close: string;
    closed?: boolean;
  }
  
  export interface SocialMediaLink {
    platform: string;
    url: string;
    icon: string;
    handle: string;
  }
  
  export interface EmergencyContact {
    type: string;
    number: string;
    description: string;
    available: string;
  }
  
  // For contact form submission response
  export interface ContactResponse {
    success: boolean;
    message: string;
    ticketId?: string;
    estimatedResponseTime?: string;
  }
  
  // For contact preferences
  export interface ContactPreferences {
    preferredMethod: 'email' | 'phone' | 'whatsapp';
    preferredTime?: 'morning' | 'afternoon' | 'evening';
    timezone?: string;
    language?: string;
  }
  
  // For newsletter subscription
  export interface NewsletterSubscription {
    email: string;
    name?: string;
    preferences?: string[];
    subscribedAt: string;
    status: 'active' | 'unsubscribed' | 'bounced';
  }