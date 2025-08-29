import { EventHero } from '@/components/EventHero';
import { EventDetails } from '@/components/EventDetails';

const Home = () => {
  return (
    <div className="min-h-screen">
      <EventHero />
      <EventDetails />
    </div>
  );
};

export default Home;