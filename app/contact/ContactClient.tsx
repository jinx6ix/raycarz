// app/contact/ContactClient.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Users,
  DollarSign,
  Globe,
  Download,
  Printer,
  Share2,
  Copy,
  Check,
  Loader2,
  MessageSquare,
  HelpCircle,
  Star,
  ThumbsUp,
  Award,
  Shield,
  Heart,
  ExternalLink
} from 'lucide-react';
import type { OfficeLocation, ContactFormData, FormErrors } from './types';
import Link from 'next/link';

interface ContactClientProps {
  office: OfficeLocation;
}

export default function ContactClient({ office }: ContactClientProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredContact: 'email',
    tourType: '',
    groupSize: 2,
    budget: '',
    newsletter: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'contact' | 'booking' | 'support'>('contact');
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [responseTime, setResponseTime] = useState<string>('');

  const formRef = useRef<HTMLFormElement>(null);

  // Set response time based on current hour
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 8 && hour < 18) {
      setResponseTime('within 1 hour');
    } else {
      setResponseTime('by 9 AM tomorrow');
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\+\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.text-red-500');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setTicketId(data.ticketId || `TKT-${Date.now()}`);
        setSubmitMessage('Your message has been sent successfully! We will get back to you shortly.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          preferredContact: 'email',
          tourType: '',
          groupSize: 2,
          budget: '',
          newsletter: false,
        });
        
        // Track conversion (optional)
        if (typeof window !== 'undefined' && (window as any).gtag) {
          window.gtag('event', 'contact_form_submission', {
            event_category: 'engagement',
            event_label: 'contact_form',
          });
        }
      } else {
        setSubmitStatus('error');
        setSubmitMessage(data.message || 'An error occurred while sending your message. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(office.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Contact RAYCARZ Tours & Safaris',
          text: 'Get in touch with our Kenya-based safari experts for personalized tour planning.',
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const tourTypes = [
    'Wildlife Safari',
    'Gorilla Trekking',
    'Beach Holiday',
    'Photography Tour',
    'Family Safari',
    'Honeymoon',
    'Group Tour',
    'Custom Itinerary',
  ];

  const budgetRanges = [
    'Under $2,000',
    '$2,000 - $3,000',
    '$3,000 - $5,000',
    '$5,000 - $7,000',
    '$7,000 - $10,000',
    'Over $10,000',
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/" className="text-amber-600 hover:text-amber-700 hover:underline">
                Home
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <li>
              <span className="text-gray-600" aria-current="page">Contact</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <Badge className="mb-4 bg-amber-100 text-amber-700 border-none">
            <MessageCircle className="w-3 h-3 mr-1" />
            We're Here to Help
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact Our Safari Experts
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Based in <span className="font-semibold text-amber-600">Nairobi, Kenya</span>. Have questions about our tours? 
            Need help planning your perfect African adventure? We're just a message away.
          </p>
          
          {/* Response Time Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 mt-4 bg-green-100 text-green-700 px-4 py-2 rounded-full"
          >
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Typical response: {responseTime}</span>
          </motion.div>
        </motion.div>

        {/* Contact Methods Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-4 mb-8"
        >
          {[
            {
              icon: <Mail className="w-5 h-5" />,
              label: 'Email',
              value: office.email,
              action: () => window.location.href = `mailto:${office.email}`,
              color: 'blue',
            },
            {
              icon: <Phone className="w-5 h-5" />,
              label: 'Phone',
              value: office.phone,
              action: () => window.location.href = `tel:${office.phone}`,
              color: 'green',
            },
            {
              icon: <MessageCircle className="w-5 h-5" />,
              label: 'WhatsApp',
              value: office.whatsapp || '+254 726 665 100',
              action: () => window.open(`https://wa.me/${office.whatsapp?.replace(/\D/g, '') || '+254787644555'}`, '_blank'),
              color: 'emerald',
            },
            {
              icon: <MapPin className="w-5 h-5" />,
              label: 'Visit Us',
              value: office.city,
              action: () => window.open(`https://maps.google.com/?q=${office.address}`, '_blank'),
              color: 'amber',
            },
          ].map((method, index) => (
            <motion.div
              key={method.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="cursor-pointer hover:shadow-md transition-all" onClick={method.action}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-${method.color}-100 flex items-center justify-center text-${method.color}-600`}>
                    {method.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{method.label}</p>
                    <p className="font-semibold text-gray-900 text-sm">{method.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Office Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    Nairobi Office
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-600">{office.address}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{office.hours}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">East Africa Time (EAT)</span>
                  </div>
                  
                  {/* Map Placeholder */}
                  <div className="mt-4 h-40 bg-gray-200 rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.846296276525!2d36.817223!3d-1.286389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d4b2f0e0e1%3A0x8c5d8f5d8f5d8f5!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      title="Nairobi Office Location"
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(`https://maps.google.com/?q=${office.address}`, '_blank')}
                  >
                    Get Directions
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Connect With Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: <Facebook />, label: 'Facebook', url: '#' },
                      { icon: <Instagram />, label: 'Instagram', url: '#' },
                      { icon: <Twitter />, label: 'Twitter', url: '#' },
                      { icon: <Youtube />, label: 'YouTube', url: '#' },
                      { icon: <Linkedin />, label: 'LinkedIn', url: '#' },
                      { icon: <MessageCircle />, label: 'WhatsApp', url: '#' },
                    ].map((social, index) => (
                      <motion.a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-8 h-8 text-gray-600 mb-1">{social.icon}</div>
                        <span className="text-xs text-gray-500">{social.label}</span>
                      </motion.a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Business Hours */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { day: 'Monday - Friday', hours: '8:00 AM - 6:00 PM' },
                    { day: 'Saturday', hours: '9:00 AM - 2:00 PM' },
                    { day: 'Sunday', hours: 'Closed' },
                    { day: 'Emergency Support', hours: '24/7' },
                  ].map((schedule, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-500">{schedule.day}</span>
                      <span className={`font-medium ${schedule.hours === 'Closed' ? 'text-red-600' : 'text-gray-900'}`}>
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-2 justify-center"
            >
              <Badge className="bg-blue-100 text-blue-700 border-none py-2">
                <Shield className="w-3 h-3 mr-1" />
                Verified Business
              </Badge>
              <Badge className="bg-green-100 text-green-700 border-none py-2">
                <Award className="w-3 h-3 mr-1" />
                Eco-Certified
              </Badge>
              <Badge className="bg-amber-100 text-amber-700 border-none py-2">
                <Heart className="w-3 h-3 mr-1" />
                500+ Reviews
              </Badge>
            </motion.div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">Send us a Message</CardTitle>
                      <CardDescription>
                        Fill out the form below and we'll get back to you within 24 hours
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={handleShare} title="Share this page">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handlePrint} title="Print">
                        <Printer className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Status Messages */}
                  <AnimatePresence>
                    {submitStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-4 bg-green-50 border border-green-500 rounded-lg"
                      >
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-green-800 font-semibold">{submitMessage}</p>
                            {ticketId && (
                              <p className="text-sm text-green-600 mt-1">
                                Reference: {ticketId}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    navigator.clipboard.writeText(ticketId);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                  }}
                                  className="ml-2 h-6 px-2"
                                >
                                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                </Button>
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {submitStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-4 bg-red-50 border border-red-500 rounded-lg"
                      >
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <p className="text-red-800 font-semibold">{submitMessage}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Form Type Tabs */}
                  <div className="flex gap-2 mb-6 border-b pb-4">
                    {[
                      { id: 'contact', label: 'General Inquiry', icon: <Mail className="w-4 h-4" /> },
                      { id: 'booking', label: 'Booking Request', icon: <Calendar className="w-4 h-4" /> },
                      { id: 'support', label: 'Customer Support', icon: <HelpCircle className="w-4 h-4" /> },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-amber-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Fields */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={`mt-2 ${errors.name ? 'border-red-500' : ''}`}
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? 'name-error' : undefined}
                        />
                        {errors.name && (
                          <p id="name-error" className="text-red-500 text-sm mt-1">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email">
                          Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`mt-2 ${errors.email ? 'border-red-500' : ''}`}
                          aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+254787644555"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`mt-2 ${errors.phone ? 'border-red-500' : ''}`}
                        aria-invalid={!!errors.phone}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Include country code for WhatsApp (e.g., +254 for Kenya)
                      </p>
                    </div>

                    {/* Preferred Contact Method */}
                    <div>
                      <Label>Preferred Contact Method</Label>
                      <div className="flex flex-wrap gap-4 mt-2">
                        {[
                          { value: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
                          { value: 'phone', label: 'Phone', icon: <Phone className="w-4 h-4" /> },
                          { value: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="w-4 h-4" /> },
                        ].map(option => (
                          <label key={option.value} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="preferredContact"
                              value={option.value}
                              checked={formData.preferredContact === option.value}
                              onChange={(e) => setFormData({ 
                                ...formData, 
                                preferredContact: e.target.value as typeof formData.preferredContact 
                              })}
                              className="text-amber-600"
                            />
                            <span className="flex items-center gap-1 text-sm">
                              {option.icon}
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">
                        Subject <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="subject"
                        placeholder="How can we help?"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className={`mt-2 ${errors.subject ? 'border-red-500' : ''}`}
                        aria-invalid={!!errors.subject}
                      />
                      {errors.subject && (
                        <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                      )}
                    </div>

                    {/* Additional Fields Toggle */}
                    <button
                      type="button"
                      onClick={() => setShowExtraFields(!showExtraFields)}
                      className="text-amber-600 hover:text-amber-700 text-sm flex items-center gap-1"
                    >
                      {showExtraFields ? 'Hide' : 'Show'} booking details
                      <ChevronRight className={`w-4 h-4 transition-transform ${showExtraFields ? 'rotate-90' : ''}`} />
                    </button>

                    {/* Extra Fields */}
                    <AnimatePresence>
                      {showExtraFields && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 overflow-hidden"
                        >
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="tourType">Tour Type</Label>
                              <select
                                title='Select the type of tour you are interested in (e.g., Wildlife Safari, Beach Holiday, Gorilla Trekking, etc.)'
                                id="tourType"
                                value={formData.tourType}
                                onChange={(e) => setFormData({ ...formData, tourType: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg mt-2 focus:outline-none focus:border-amber-500"
                              >
                                <option value="">Select tour type</option>
                                {tourTypes.map(type => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <Label htmlFor="groupSize">Group Size</Label>
                              <div className="flex items-center gap-2 mt-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setFormData({ 
                                    ...formData, 
                                    groupSize: Math.max(1, (formData.groupSize || 2) - 1) 
                                  })}
                                >
                                  -
                                </Button>
                                <span className="w-12 text-center">{formData.groupSize}</span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setFormData({ 
                                    ...formData, 
                                    groupSize: (formData.groupSize || 2) + 1 
                                  })}
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="budget">Budget Range (per person)</Label>
                            <select
                              title='Select the budget range you are interested in (e.g., $500-$1000, $1000-$1500, etc.)'
                              id="budget"
                              value={formData.budget}
                              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg mt-2 focus:outline-none focus:border-amber-500"
                            >
                              <option value="">Select budget</option>
                              {budgetRanges.map(range => (
                                <option key={range} value={range}>{range}</option>
                              ))}
                            </select>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div>
                      <Label htmlFor="message">
                        Message <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your inquiry, preferred travel dates, special requests, or any questions you have..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className={`mt-2 min-h-32 ${errors.message ? 'border-red-500' : ''}`}
                        aria-invalid={!!errors.message}
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Characters: {formData.message.length} / 1000
                      </p>
                    </div>

                    {/* Newsletter Opt-in */}
                    <div className="flex items-center gap-2">
                      <input
                        title='Subscribe to our newsletter for safari tips and special offers'
                        type="checkbox"
                        id="newsletter"
                        checked={formData.newsletter}
                        onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                        className="rounded text-amber-600"
                      />
                      <Label htmlFor="newsletter" className="text-sm text-gray-600">
                        Subscribe to our newsletter for safari tips and special offers
                      </Label>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      By submitting this form, you agree to our{' '}
                      <Link href="/privacy" className="text-amber-600 hover:underline">
                        Privacy Policy
                      </Link>
                      . We'll never share your information with third parties.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
              <CardDescription>
                Quick answers to common questions about contacting us and booking tours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    q: "How quickly do you respond to inquiries?",
                    a: "We typically respond within 1-2 hours during business hours (Monday-Friday, 8AM-6PM EAT) and within 12 hours on weekends."
                  },
                  {
                    q: "Can I book a tour over the phone?",
                    a: "Yes! Call us at +254787644555 to discuss your tour preferences and book directly with our team."
                  },
                  {
                    q: "Do you offer video consultations?",
                    a: "Absolutely! We can arrange Zoom or WhatsApp video calls to discuss your tour plans in detail."
                  },
                  {
                    q: "What information should I include in my inquiry?",
                    a: "Include your preferred destinations, travel dates, group size, budget, and any special interests or requirements."
                  },
                  {
                    q: "Is WhatsApp available for international inquiries?",
                    a: "Yes! Add +254787644555 to your contacts and message us on WhatsApp for quick responses."
                  },
                  {
                    q: "Do you have a physical office I can visit?",
                    a: "Our main office is in Westlands, Nairobi, Kenya. We welcome visitors by appointment Monday-Friday."
                  }
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      {faq.q}
                    </h3>
                    <p className="text-gray-600 text-sm pl-6">{faq.a}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Emergency Support Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Phone className="w-8 h-8" />
              <div>
                <h3 className="text-xl font-bold">Emergency Support Available 24/7</h3>
                <p className="text-red-100">For urgent assistance during your safari, call our emergency line</p>
              </div>
            </div>
            <a
              href="tel:+254787644555"
              className="bg-white text-red-700 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              +254787644555
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}