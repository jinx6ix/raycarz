'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import tours from '@/data/tours.json';

interface BookingFormData {
  tourId: string;
  tourTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  numberOfGuests: number;
  startDate: string;
  specialRequests: string;
  price: number;
  currency: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function BookingClient() {
  const [formData, setFormData] = useState<BookingFormData>({
    tourId: '',
    tourTitle: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    numberOfGuests: 1,
    startDate: '',
    specialRequests: '',
    price: 0,
    currency: 'USD',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const selectedTour = tours.find((t) => t.id === formData.tourId);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.tourId) newErrors.tourId = 'Please select a tour';
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Please enter a valid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.numberOfGuests || formData.numberOfGuests < 1)
      newErrors.numberOfGuests = 'Number of guests must be at least 1';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTourChange = (tourId: string) => {
    const tour = tours.find((t) => t.id === tourId);
    if (tour) {
      setFormData({
        ...formData,
        tourId,
        tourTitle: tour.title,
        price: tour.price,
        currency: tour.currency,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Combine first and last name for API
      const bookingPayload = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        tourTitle: formData.tourTitle,
        numberOfGuests: formData.numberOfGuests,
        startDate: formData.startDate,
        specialRequests: formData.specialRequests,
        price: formData.price,
        currency: formData.currency,
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
        setSubmitMessage(`Booking confirmed! Your booking reference is: ${data.bookingId}`);
        setFormData({
          tourId: '',
          tourTitle: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          country: '',
          numberOfGuests: 1,
          startDate: '',
          specialRequests: '',
          price: 0,
          currency: 'USD',
        });
      } else {
        setSubmitStatus('error');
        setSubmitMessage(data.message || 'An error occurred while submitting your booking');
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage('An error occurred while submitting your booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Book Your Safari Tour</h1>
          <p className="text-xl text-gray-600">
            Reserve your African adventure. Fill out the form below and our team will contact you to confirm your booking.
          </p>
        </div>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <Card className="mb-8 border-green-500 bg-green-50">
            <CardContent className="pt-6">
              <p className="text-green-800 font-semibold">{submitMessage}</p>
              <p className="text-green-700 mt-2">
                Check your email for confirmation details. Our team will contact you within 24 hours.
              </p>
            </CardContent>
          </Card>
        )}

        {submitStatus === 'error' && (
          <Card className="mb-8 border-red-500 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800 font-semibold">{submitMessage}</p>
            </CardContent>
          </Card>
        )}

        {/* Booking Form */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
            <CardDescription>Select your tour and provide your information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Tour Selection */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">Select Your Tour</h3>
                <div>
                  <Label htmlFor="tour">Tour *</Label>
                  <Select value={formData.tourId} onValueChange={handleTourChange}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a tour..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {tours.map((tour) => (
                        <SelectItem key={tour.id} value={tour.id}>
                          {tour.title} - ${tour.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.tourId && <p className="text-red-500 text-sm mt-1">{errors.tourId}</p>}
                </div>

                {selectedTour && (
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <p className="text-sm text-gray-600">
                      <strong>Duration:</strong> {selectedTour.duration}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Best Season:</strong> {selectedTour.bestSeason}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Group Size:</strong> {selectedTour.groupSize}
                    </p>
                  </div>
                )}
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">Your Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="mt-2"
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="mt-2"
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-2"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-2"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="country">Country of Residence *</Label>
                  <Input
                    id="country"
                    placeholder="United States"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="mt-2"
                  />
                  {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                </div>
              </div>

              {/* Trip Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">Trip Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="numberOfGuests">Number of Guests *</Label>
                    <Input
                      id="numberOfGuests"
                      type="number"
                      min="1"
                      value={formData.numberOfGuests}
                      onChange={(e) => setFormData({ ...formData, numberOfGuests: parseInt(e.target.value) || 1 })}
                      className="mt-2"
                    />
                    {errors.numberOfGuests && <p className="text-red-500 text-sm mt-1">{errors.numberOfGuests}</p>}
                  </div>
                  <div>
                    <Label htmlFor="startDate">Preferred Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="mt-2"
                    />
                    {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                  <Textarea
                    id="specialRequests"
                    placeholder="Vegetarian meals, dietary restrictions, physical limitations, etc..."
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    className="mt-2 min-h-24"
                  />
                </div>
              </div>

              {/* Price Summary */}
              {selectedTour && (
                <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-700">
                      <span>Price per person:</span>
                      <span>
                        {formData.currency} {selectedTour.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Number of guests:</span>
                      <span>{formData.numberOfGuests}</span>
                    </div>
                    <div className="border-t border-amber-300 pt-2 flex justify-between text-lg font-bold text-amber-900">
                      <span>Total Price:</span>
                      <span>
                        {formData.currency} {(selectedTour.price * formData.numberOfGuests).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-amber-800 mt-4">
                    Note: 30% deposit required to confirm booking. Balance due before tour starts.
                  </p>
                </div>
              )}

              {/* Terms */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  By submitting this form, you agree to our cancellation policy and terms of service. A confirmation
                  email will be sent to your provided email address with next steps.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting Your Booking...' : 'Submit Booking'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}