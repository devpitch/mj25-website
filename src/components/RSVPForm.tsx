import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Plus, Trash2, Users, Mail, Phone, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Guest {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface RSVPFormProps {
  maxGuests?: number;
  guestId?: string;
}

export const RSVPForm = ({ maxGuests = 4, guestId }: RSVPFormProps) => {
  const [guests, setGuests] = useState<Guest[]>([
    { id: '1', name: '', phone: '', email: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const addGuest = () => {
    if (guests.length < maxGuests) {
      setGuests([...guests, { 
        id: Date.now().toString(), 
        name: '', 
        phone: '', 
        email: '' 
      }]);
    }
  };

  const removeGuest = (id: string) => {
    if (guests.length > 1) {
      setGuests(guests.filter(guest => guest.id !== id));
    }
  };

  const updateGuest = (id: string, field: keyof Guest, value: string) => {
    setGuests(guests.map(guest => 
      guest.id === id ? { ...guest, [field]: value } : guest
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    const hasValidGuests = guests.every(guest => 
      guest.name.trim() && guest.phone.trim() && guest.email.trim()
    );

    if (!hasValidGuests) {
      toast({
        title: "Please fill in all required fields",
        description: "Name, phone, and email are required for all guests",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Here you would normally save to database
      console.log('RSVP Data:', { guestId, guests });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "RSVP Submitted Successfully!",
        description: "Your invitation will be sent via email shortly",
      });

      // Reset form or redirect to confirmation page
    } catch (error) {
      toast({
        title: "Error submitting RSVP",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-elegant border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-wedding-primary font-poppins">
              RSVP for MJ's 25th Anniversary
            </CardTitle>
            <p className="text-muted-foreground">
              Please provide details for all guests attending ({guests.length}/{maxGuests})
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {guests.map((guest, index) => (
                <Card key={guest.id} className="border border-wedding-sage/30 bg-wedding-cream/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-wedding-primary flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Guest {index + 1}
                      </h3>
                      {guests.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeGuest(guest.id)}
                          className="text-destructive border-destructive hover:bg-destructive hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor={`name-${guest.id}`} className="text-wedding-primary font-medium">
                          Full Name *
                        </Label>
                        <Input
                          id={`name-${guest.id}`}
                          value={guest.name}
                          onChange={(e) => updateGuest(guest.id, 'name', e.target.value)}
                          placeholder="Enter full name"
                          className="border-wedding-sage/50 focus:border-wedding-gold"
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`phone-${guest.id}`} className="text-wedding-primary font-medium">
                            <Phone className="w-4 h-4 inline mr-1" />
                            Phone Number *
                          </Label>
                          <Input
                            id={`phone-${guest.id}`}
                            value={guest.phone}
                            onChange={(e) => updateGuest(guest.id, 'phone', e.target.value)}
                            placeholder="+1 (555) 123-4567"
                            className="border-wedding-sage/50 focus:border-wedding-gold"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor={`email-${guest.id}`} className="text-wedding-primary font-medium">
                            <Mail className="w-4 h-4 inline mr-1" />
                            Email Address *
                          </Label>
                          <Input
                            id={`email-${guest.id}`}
                            type="email"
                            value={guest.email}
                            onChange={(e) => updateGuest(guest.id, 'email', e.target.value)}
                            placeholder="guest@example.com"
                            className="border-wedding-sage/50 focus:border-wedding-gold"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {guests.length < maxGuests && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addGuest}
                  className="w-full border-wedding-gold text-wedding-gold hover:bg-wedding-gold hover:text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Guest
                </Button>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-gold text-white font-semibold py-3 shadow-gold"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting RSVP...' : 'Submit RSVP'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};