// app/about/AboutClient.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  Users, 
  Globe, 
  Award, 
  Heart, 
  Leaf,
  TreePine,
  Landmark,
  Target,
  Eye,
  Sparkles,
  Quote,
  Star,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ExternalLink,
  Share2,
  Download,
  BookOpen,
  Camera,
  Film,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  X
} from 'lucide-react';
import type { TeamMember, CompanyStat, Testimonial } from './types';

interface AboutClientProps {
  teamMembers: TeamMember[];
  stats: {
    yearsExperience: number;
    happyCustomers: number;
    countries: number;
    tours: number;
    teamMembers: number;
  };
  testimonials: Testimonial[];
}

export default function AboutClient({ teamMembers, stats, testimonials }: AboutClientProps) {
  const [activeSection, setActiveSection] = useState<string>('story');
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const missionRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });

  // Company milestones timeline
  const milestones = [
    { year: 2003, title: 'Founded', description: 'RAYCARZ Tours & Safaris was established in Nairobi, Kenya' },
    { year: 2005, title: 'Expanded to Tanzania', description: 'Opened office in Arusha and started offering Serengeti safaris' },
    { year: 2008, title: 'First Conservation Partnership', description: 'Partnered with Kenya Wildlife Service for anti-poaching initiatives' },
    { year: 2010, title: 'Uganda Office Opened', description: 'Started gorilla trekking expeditions in Bwindi' },
    { year: 2012, title: 'Rwanda Expansion', description: 'Added Volcanoes National Park gorilla experiences' },
    { year: 2015, title: 'Sustainability Award', description: 'Received Eco-Tourism Kenya Gold Award' },
    { year: 2018, title: '10,000 Happy Customers', description: 'Celebrated major milestone with community project' },
    { year: 2020, title: 'Carbon Neutral Certification', description: 'Became first carbon-neutral safari company in East Africa' },
    { year: 2023, title: '20th Anniversary', description: 'Celebrated 20 years of excellence in safari tourism' },
  ];

  // Filter milestones by year
  const filteredMilestones = selectedYear 
    ? milestones.filter(m => m.year === selectedYear)
    : milestones;

  // Handle share
  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'RAYCARZ Tours & Safaris - About Us',
          text: 'Learn about our story, mission, and commitment to sustainable tourism in East Africa.',
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
    setShowShareMenu(false);
  };

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      
      {/* Breadcrumb Navigation */}
      <nav className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <ol className="flex items-center gap-2 text-sm flex-wrap">
            <li>
              <Link href="/" className="text-amber-600 hover:text-amber-700 hover:underline">
                Home
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <li>
              <span className="text-gray-600" aria-current="page">About Us</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Table of Contents (Sticky) */}
      <div className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between overflow-x-auto py-2 gap-4">
            <div className="flex gap-4 text-sm">
              {[
                { id: 'story', label: 'Our Story' },
                { id: 'mission', label: 'Mission & Values' },
                { id: 'team', label: 'Our Team' },
                { id: 'impact', label: 'Impact' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-1 rounded-full transition-colors whitespace-nowrap ${
                    activeSection === item.id
                      ? 'bg-amber-600 text-white'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section with Video */}
      <section className="relative bg-gradient-to-br from-amber-600 to-amber-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10" />
        
        {/* Background Video/Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/about-hero.jpg"
            alt="African safari landscape"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 py-20 md:py-28 px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
                <Sparkles className="w-3 h-3 mr-1" />
                Est. 2003
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance">
                About RAYCARZ Tours & Safaris
              </h1>
              <p className="text-xl opacity-90 text-pretty max-w-2xl mx-auto mt-6">
                Creating unforgettable wildlife experiences while supporting local communities 
                and conservation efforts across East Africa.
              </p>
            </motion.div>

            {/* Play Video Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => setShowVideo(true)}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition-colors"
            >
              <Play className="w-4 h-4" />
              Watch Our Story
            </motion.button>
          </div>
        </div>

        {/* Stats Overlay */}
        <div className="relative z-20 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {isStatsInView && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="text-2xl md:text-3xl font-bold">{stats.yearsExperience}+</div>
                    <div className="text-sm opacity-80">Years Experience</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="text-2xl md:text-3xl font-bold">{stats.happyCustomers.toLocaleString()}+</div>
                    <div className="text-sm opacity-80">Happy Travelers</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="text-2xl md:text-3xl font-bold">{stats.countries}</div>
                    <div className="text-sm opacity-80">Countries</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="text-2xl md:text-3xl font-bold">{stats.tours}+</div>
                    <div className="text-sm opacity-80">Expert Tours</div>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setShowVideo(false)}
          >
            <div className="relative w-full max-w-4xl">
              <button
               title='Close Video'
                onClick={() => setShowVideo(false)}
                className="absolute -top-12 right-0 text-white hover:text-amber-500"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  src="/videos/about-story.mp4"
                  poster="/images/video-poster.jpg"
                  className="w-full h-full"
                  controls
                  autoPlay
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Our Story Section */}
      <section id="story" ref={storyRef} className="py-16 md:py-24 px-4 md:px-6 lg:px-8 scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <Badge className="bg-amber-100 text-amber-700 border-none">Our Journey</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Story</h2>
              <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                <p>
                  <span className="font-semibold text-amber-600">RAYCARZ Tours & Safaris</span> was founded in 2003 on a passion for African wildlife and a commitment to providing exceptional safari experiences. With over 20 years of combined experience in the safari industry, our team has guided thousands of travelers through the most remarkable ecosystems on Earth.
                </p>
                <p>
                  We believe that <span className="font-semibold text-amber-600">sustainable tourism and wildlife conservation</span> go hand in hand. Our tours are designed not just to showcase Africa's incredible biodiversity, but to directly support the communities and protected areas that make these experiences possible.
                </p>
                <p>
                  Every booking with us contributes to <span className="font-semibold text-amber-600">wildlife protection, community development, and environmental conservation</span> in East Africa.
                </p>
              </div>

              {/* Timeline Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowTimeline(!showTimeline)}
                className="mt-4"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {showTimeline ? 'Hide' : 'View'} Our Timeline
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="text-4xl font-bold text-amber-600 mb-2">{stats.yearsExperience}+</div>
                  <p className="text-gray-700 font-medium">Years of Excellence</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="text-4xl font-bold text-amber-600 mb-2">{stats.happyCustomers.toLocaleString()}+</div>
                  <p className="text-gray-700 font-medium">Happy Travelers</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="text-4xl font-bold text-amber-600 mb-2">{stats.countries}</div>
                  <p className="text-gray-700 font-medium">Countries Covered</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="text-4xl font-bold text-amber-600 mb-2">{stats.tours}+</div>
                  <p className="text-gray-700 font-medium">Curated Tours</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm col-span-2">
                  <div className="text-4xl font-bold text-amber-600 mb-2">{stats.teamMembers}+</div>
                  <p className="text-gray-700 font-medium">Expert Team Members</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Timeline */}
          <AnimatePresence>
            {showTimeline && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-12 overflow-hidden"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Journey Through Time</h3>
                
                {/* Year Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    onClick={() => setSelectedYear(null)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedYear === null
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  {milestones.map(m => (
                    <button
                      key={m.year}
                      onClick={() => setSelectedYear(m.year)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedYear === m.year
                          ? 'bg-amber-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {m.year}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  {filteredMilestones.map((milestone, index) => (
                    <motion.div
                      key={milestone.year}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 items-start"
                    >
                      <div className="w-20 flex-shrink-0 font-bold text-amber-600">{milestone.year}</div>
                      <div className="flex-1 pb-4 border-l-2 border-amber-200 pl-4">
                        <h4 className="font-bold text-gray-900">{milestone.title}</h4>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section id="mission" ref={missionRef} className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-slate-50 scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-amber-100 text-amber-700 border-none">Our Purpose</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">Our Mission & Values</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Leaf className="w-8 h-8" />,
                title: 'Conservation',
                description: "We're committed to protecting East Africa's incredible wildlife and ecosystems. A portion of every tour booking goes directly to conservation initiatives and protected areas.",
                color: 'green',
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Community Impact',
                description: "We employ local guides, support local businesses, and invest in community development projects. Tourism should benefit the communities that share their land with us.",
                color: 'blue',
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: 'Excellence',
                description: "We provide world-class safari experiences with expert guides, comfortable accommodations, and meticulous attention to detail. Your satisfaction is our priority.",
                color: 'amber',
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-full bg-${value.color}-100 flex items-center justify-center text-${value.color}-600 mb-4`}>
                      {value.icon}
                    </div>
                    <CardTitle className="text-2xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Why Choose Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Why Travelers Choose Us</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Expert Local Guides',
                  description: 'Our guides are passionate about wildlife and deeply knowledgeable about animal behavior, ecology, and local culture. Many grew up in the regions they guide.',
                },
                {
                  title: 'Customizable Itineraries',
                  description: 'Every traveler is different. We work with you to create the perfect safari experience tailored to your interests and budget.',
                },
                {
                  title: 'Competitive Pricing',
                  description: 'We offer excellent value without compromising quality. Our transparent pricing means no hidden fees or surprises.',
                },
                {
                  title: '24/7 Support',
                  description: 'Round-the-clock assistance, experienced teams, certified vehicles, and comprehensive insurance ensure your peace of mind throughout your journey.',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 p-4 bg-white rounded-lg shadow-sm"
                >
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" ref={teamRef} className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-amber-100 text-amber-700 border-none">Meet the Team</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">Our Leadership & Guides</h2>
            <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
              Our diverse team brings together decades of safari expertise, local knowledge, and a genuine passion for African wildlife and culture.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers?.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
                  <div className="relative h-64 w-full bg-gray-200">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                        <Users className="w-16 h-16 text-amber-600" />
                      </div>
                    )}
                    {member.featured && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-amber-600 text-white">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{member.name}</CardTitle>
                    <CardDescription className="text-amber-600 font-medium">
                      {member.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-3">{member.bio}</p>
                    
                    {member.expertise && (
                      <div className="flex flex-wrap gap-2">
                        {member.expertise.slice(0, 3).map(skill => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {member.languages && (
                      <p className="text-xs text-gray-500">
                        Speaks: {member.languages.join(', ')}
                      </p>
                    )}

                    {member.yearsExperience && (
                      <p className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {member.yearsExperience}+ years experience
                      </p>
                    )}
                  </CardContent>
                  {member.socialLinks && (
                    <CardFooter className="flex gap-2 pt-0">
                      {member.socialLinks.linkedin && (
                        <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin  className="w-4 h-4 text-gray-400 hover:text-blue-600 transition-colors" />
                        </a>
                      )}
                      {member.socialLinks.twitter && (
                        <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="w-4 h-4 text-gray-400 hover:text-sky-500 transition-colors" />
                        </a>
                      )}
                      {member.email && (
                        <a href={`mailto:${member.email}`}>
                          <Mail className="w-4 h-4 text-gray-400 hover:text-amber-600 transition-colors" />
                        </a>
                      )}
                    </CardFooter>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <p className="text-gray-600 text-lg">
              Plus {stats.teamMembers - (teamMembers?.length || 0)} expert guides and support staff across East Africa
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-amber-100 text-amber-700 border-none">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">What Our Travelers Say</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials?.slice(0, 3).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <Quote className="w-8 h-8 text-amber-300 mb-4" />
                    <p className="text-gray-600 mb-4 line-clamp-4">"{testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      {testimonial.image ? (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.author}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-amber-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.author}</p>
                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < testimonial.rating
                                  ? 'text-amber-500 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {testimonial.verified && (
                      <Badge variant="outline" className="mt-3 bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified Traveler
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Link href="/testimonials">
              <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                Read More Reviews
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Sustainability Initiatives */}
      <section id="impact" className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-emerald-50 scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-green-100 text-green-700 border-none">Our Impact</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">Commitment to Sustainability</h2>
            <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
              We believe tourism should leave the world better than we found it. Here's how we're making a difference:
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <TreePine className="w-8 h-8" />,
                title: 'Wildlife Conservation',
                items: [
                  'Support for protected areas and anti-poaching initiatives',
                  'Funding for wildlife research and monitoring',
                  'Habitat restoration projects',
                ],
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Community Development',
                items: [
                  'Fair wages and benefits for local staff',
                  'Education scholarships for local children',
                  'Skills training and employment opportunities',
                ],
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: 'Environmental Protection',
                items: [
                  'Carbon-neutral operations',
                  'Waste reduction and recycling programs',
                  'Water conservation initiatives',
                ],
              },
              {
                icon: <Landmark className="w-8 h-8" />,
                title: 'Cultural Preservation',
                items: [
                  'Support for indigenous cultural practices',
                  'Fair representation and compensation',
                  'Educational cultural exchange',
                ],
              },
            ].map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-full bg-${index === 0 ? 'green' : index === 1 ? 'blue' : index === 2 ? 'emerald' : 'amber'}-100 flex items-center justify-center text-${index === 0 ? 'green' : index === 1 ? 'blue' : index === 2 ? 'emerald' : 'amber'}-600 mb-3`}>
                      {section.icon}
                    </div>
                    <CardTitle>{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-green-600 font-bold mt-1">✓</span>
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Impact Numbers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
          >
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-1">500+</div>
              <p className="text-sm text-gray-600">Trees Planted</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-1">50+</div>
              <p className="text-sm text-gray-600">Scholarships</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-1">100%</div>
              <p className="text-sm text-gray-600">Carbon Neutral</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-1">10+</div>
              <p className="text-sm text-gray-600">Conservation Partners</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-amber-100 text-amber-700 border-none">Recognition</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">Awards & Certifications</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { name: 'Eco-Tourism Kenya', year: '2023', icon: <Leaf className="w-8 h-8" /> },
              { name: 'World Travel Awards', year: '2022', icon: <Award className="w-8 h-8" /> },
              { name: 'Sustainable Tourism', year: '2023', icon: <Globe className="w-8 h-8" /> },
              { name: 'Excellence in Service', year: '2023', icon: <Star className="w-8 h-8" /> },
            ].map((award, index) => (
              <motion.div
                key={award.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mx-auto mb-3">
                  {award.icon}
                </div>
                <h3 className="font-bold text-gray-900">{award.name}</h3>
                <p className="text-sm text-amber-600">{award.year}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & CTA Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-gradient-to-r from-amber-600 to-amber-700 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-balance">
              Join Us on an African Adventure
            </h2>
            <p className="text-lg opacity-90 text-pretty max-w-2xl mx-auto mt-4">
              Experience the magic of East Africa while supporting conservation and local communities.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Link href="/tours">
              <Button size="lg" className="bg-white text-amber-700 hover:bg-gray-100 w-full sm:w-auto">
                Browse Tours
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                Contact Us
              </Button>
            </Link>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 pt-8 text-sm"
          >
            <a href="mailto:info@raycarz.com" className="flex items-center hover:underline">
              <Mail className="w-4 h-4 mr-2" />
              info@raycarz.com
            </a>
            <a href="tel:+254XXX123456" className="flex items-center hover:underline">
              <Phone className="w-4 h-4 mr-2" />
              +254 XXX 123456
            </a>
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Nairobi, Kenya
            </span>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex justify-center gap-4 pt-4"
          >
            <a href="#" className="text-white/80 hover:text-white transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}