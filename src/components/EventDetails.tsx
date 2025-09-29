import { Card, CardContent } from "./ui/card";
import { Clock, MapPin, Camera, Music, Utensils } from "lucide-react";

const eventPhases = [
  {
    icon: Camera,
    title: "Engagement",
    time: "7:00 AM",
    location: "Nigerian Law School, Bwari, Abuja (Dinner Hall)",
    description: "Capture beautiful moments as we celebrate our love",
  },
  {
    icon: Music,
    title: "Wedding Ceremony",
    time: "10:00 AM",
    location: "St. Theresa Catholic Church, Bwari, Abuja",
    description: "Wedding Mass and blessing in God's presence",
  },
  {
    icon: Utensils,
    title: "Reception & Dinner",
    time: "01:00 PM",
    location: "Nigerian Law School, Bwari, Abuja (Dinner Hall)",
    description: "Celebration dinner, speeches, and dancing",
  },
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
            <Card
              key={index}
              className="shadow-elegant border-0 bg-white/80 backdrop-blur-sm hover:shadow-gold transition-all duration-300"
            >
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

                <p className="text-muted-foreground">{phase.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Map placeholder */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="shadow-elegant border-0 overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-wedding-sage/20 h-40 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-wedding-primary mx-auto mb-2" />
                  <h3 className="text-xl font-bold text-wedding-primary mb-1">
                    Event Location
                  </h3>
                  <p className="text-muted-foreground">
                    St. Theresa Catholic Church, Bwari, Abuja
                  </p>
                </div>
              </div>
              <div className="h-80 w-full -mt-2">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d12628.15276324134!2d7.385722!3d9.276267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sng!4v1694035200000!5m2!1sen!2sng"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
