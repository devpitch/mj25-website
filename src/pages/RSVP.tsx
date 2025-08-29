import { useParams } from 'react-router-dom';
import { RSVPForm } from '@/components/RSVPForm';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const RSVP = () => {
  const { id } = useParams();
  const [isValidLink, setIsValidLink] = useState<boolean | null>(null);
  const [guestData, setGuestData] = useState<any>(null);

  useEffect(() => {
    // Validate RSVP link and get guest data
    const validateLink = async () => {
      if (!id) {
        setIsValidLink(false);
        return;
      }

      try {
        // Here you would normally validate the link with your backend
        // For now, we'll simulate validation
        console.log('Validating RSVP link:', id);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock validation - in real app, this would check database
        const validIds = ['abc123', 'def456', 'ghi789'];
        const isValid = validIds.includes(id);
        
        setIsValidLink(isValid);
        
        if (isValid) {
          // Mock guest data
          setGuestData({
            maxGuests: 4,
            alreadyRegistered: false
          });
        }
      } catch (error) {
        setIsValidLink(false);
      }
    };

    validateLink();
  }, [id]);

  if (isValidLink === null) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-wedding-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-wedding-primary">Validating your invitation...</p>
        </div>
      </div>
    );
  }

  if (!isValidLink) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
        <Card className="w-full max-w-md shadow-elegant border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            
            <h2 className="text-2xl font-bold text-wedding-primary mb-4 font-poppins">
              Invalid Invitation Link
            </h2>
            
            <p className="text-muted-foreground mb-6">
              This invitation link is not valid or may have expired. Please contact the event organizers for assistance.
            </p>
            
            <a href="/" className="text-wedding-gold hover:underline">
              Return to Home
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <RSVPForm 
      maxGuests={guestData?.maxGuests || 4} 
      guestId={id} 
    />
  );
};

export default RSVP;