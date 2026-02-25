'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TourBookingFormProps {
  tour: {
    id: string;
    title: string;
    price: number;
    currency: string;
    duration: string;
    groupSize: string;
    difficulty: string;
    bestSeason: string;
    originalPrice?: number;
  };
}

export default function TourBookingForm({ tour }: TourBookingFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    numberOfGuests: '1',
    startDate: '',
    specialRequests: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name required';
    if (!formData.email.trim()) newErrors.email = 'Email required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number required';
    if (!formData.country.trim()) newErrors.country = 'Country required';
    if (!formData.numberOfGuests) newErrors.numberOfGuests = 'Number of guests required';
    if (!formData.startDate) newErrors.startDate = 'Start date required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const bookingPayload = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        tourTitle: tour.title,
        numberOfGuests: parseInt(formData.numberOfGuests),
        startDate: formData.startDate,
        specialRequests: formData.specialRequests,
        price: tour.price,
        currency: tour.currency,
      };

      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setSubmitMessage(`Booking confirmed! Reference: ${data.bookingId}`);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          country: '',
          numberOfGuests: '1',
          startDate: '',
          specialRequests: '',
        });
        // Close form after success
        setTimeout(() => {
          setIsOpen(false);
          setSubmitStatus('idle');
        }, 3000);
      } else {
        setSubmitStatus('error');
        setSubmitMessage(data.message || 'Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setSubmitStatus('error');
      setSubmitMessage('An error occurred. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isOpen) {
    return (
      <Card className="sticky top-4 border-2 border-amber-500 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Book This Tour</CardTitle>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ✕
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone & Country */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                  placeholder="+254787644555"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                  placeholder="United States"
                />
                {errors.country && (
                  <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                )}
              </div>
            </div>

            {/* Guests & Start Date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  # of Guests *
                </label>
                <select
                  title='Select number of guests'
                  name="numberOfGuests"
                  value={formData.numberOfGuests}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>
                      {num} {num > 1 ? 'people' : 'person'}
                    </option>
                  ))}
                </select>
                {errors.numberOfGuests && (
                  <p className="text-red-500 text-xs mt-1">{errors.numberOfGuests}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  title='Select start date'
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                />
                {errors.startDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
                )}
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Special Requests (Optional)
              </label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm resize-none"
                placeholder="Dietary requirements, accessibility needs, etc."
              />
            </div>

            {/* Status Message */}
            {submitStatus === 'success' && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm font-medium">{submitMessage}</p>
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm font-medium">{submitMessage}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white text-base py-5"
            >
              {isSubmitting ? 'Submitting...' : `Book Now - $${tour.price}`}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              We'll contact you within 24 hours to confirm
            </p>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Collapsed View
  return (
    <Card className="sticky top-4 border-2 border-amber-500 bg-gradient-to-br from-white to-amber-50">
      <CardHeader className="space-y-4">
        <div>
          {tour.originalPrice && (
            <div className="text-sm text-gray-400 line-through">
              ${tour.originalPrice.toLocaleString()}
            </div>
          )}
          <div className="text-4xl font-bold text-amber-600">
            ${tour.price.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">per person</div>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white text-lg py-6 font-semibold"
        >
          Book This Tour
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 border-t pt-4">
        <div className="space-y-3">
          <div className="text-sm">
            <span className="text-gray-600">Duration:</span>
            <span className="font-bold ml-2">{tour.duration}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">Group Size:</span>
            <span className="font-bold ml-2">{tour.groupSize}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">Difficulty:</span>
            <span className="font-bold ml-2">{tour.difficulty}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">Best Season:</span>
            <span className="font-bold ml-2 text-sm">{tour.bestSeason}</span>
          </div>
        </div>

        {/* Quick Contact */}
        <div className="pt-2 border-t">
          <a
            href={`https://wa.me/254726665100?text=${encodeURIComponent(
              `Hi, I'm interested in the ${tour.title} tour`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition"
          >
            Chat on WhatsApp
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
