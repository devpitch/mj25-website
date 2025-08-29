import { Card, CardContent } from './ui/card';
import { Clock, MapPin, Camera, Music, Utensils } from 'lucide-react';

const eventPhases = [
  {
    icon: Camera,
    title: "Engagement Photos",
    time: "3:00 PM - 4:00 PM",
    location: "Garden Pavilion",
    description: "Capture beautiful moments as we celebrate their journey"
  },
  {
    icon: Music,
    title: "Wedding Ceremony", 
    time: "4:30 PM - 5:30 PM",
    location: "Main Chapel",
    description: "Wedding ceremony and blessing"
  },
  {
    icon: Utensils,
    title: "Reception & Dinner",
    time: "6:00 PM - 10:00 PM", 
    location: "Grand Ballroom",
    description: "Celebration dinner, speeches, and dancing"
  }
];

export const EventDetails = () => {
  return (
    <section className="py-20 bg-gradient-soft">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-wedding-primary mb-4 font-poppins">
            Celebration Timeline
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join us for a day filled with love, joy, and unforgettable memories
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {eventPhases.map((phase, index) => (
            <Card key={index} className="shadow-elegant border-0 bg-white/80 backdrop-blur-sm hover:shadow-gold transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-gold">
                  <phase.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-wedding-primary mb-3 font-poppins">
                  {phase.title}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-center gap-2 text-wedding-gold">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{phase.time}</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{phase.location}</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground">
                  {phase.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Map placeholder */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="shadow-elegant border-0 overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-wedding-sage/20 h-80 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-wedding-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-wedding-primary mb-2">Event Location</h3>
                  <p className="text-muted-foreground">Interactive map will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};