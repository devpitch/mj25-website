import { CountdownTimer } from './CountdownTimer';
import { Button } from './ui/button';
import { Calendar, MapPin, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export const EventHero = () => {
  const eventDate = "2024-12-31T18:00:00";
  const navigate = useNavigate();
  return <section className="relative min-h-screen bg-gradient-hero flex items-center justify-center overflow-hidden py-16">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-wedding-gold rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-wedding-gold rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Logo */}
        <div className="mb-8">
          <img src="/lovable-uploads/c1317d0c-7591-4640-9b42-865bd23e58f7.png" alt="MJ 25th Wedding Logo" className="w-32 h-32 mx-auto drop-shadow-2xl" />
        </div>

        {/* Main heading */}
        <div className="mb-6">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 font-poppins">
            MJ's 25th
          </h1>
           <h2 className="text-2xl md:text-4xl text-white/90 font-light">
             Wedding Celebration
           </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Heart className="w-6 h-6 text-wedding-gold" />
            <span className="text-wedding-gold font-medium">A Milestone Worth Celebrating</span>
            <Heart className="w-6 h-6 text-wedding-gold" />
          </div>
        </div>

        {/* Event details */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-center gap-2 text-white/90">
            <Calendar className="w-5 h-5" />
            <span className="text-lg">25th October, 2025</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-white/90">
            <MapPin className="w-5 h-5" />
            <span className="text-lg">Grand Celebration Venue, Abuja</span>
          </div>
        </div>

        {/* Countdown timer */}
        <div className="mb-12">
          <h3 className="text-xl text-white/90 mb-6 font-medium">Celebration Begins In</h3>
          <CountdownTimer targetDate={eventDate} />
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-wedding-gold hover:bg-wedding-gold/90 text-wedding-primary font-semibold px-8 py-3 text-lg shadow-gold" onClick={() => navigate('/rsvp/abc123')}>
            RSVP Now
          </Button>
          <Button variant="outline" size="lg" className="border-white text-wedding-primary hover:bg-white hover:text-wedding-primary px-8 py-3 text-lg" onClick={() => navigate('/gallery')}>
            View Gallery
          </Button>
        </div>
      </div>
    </section>;
};