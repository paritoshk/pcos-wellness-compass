import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { BadgeCheck } from 'lucide-react';

interface ExpertType {
  id: string;
  name: string;
  title: string;
  specialty: string;
  description: string;
  image: string;
  badges: string[];
  availability: string;
  isVerified: boolean;
}

const experts: ExpertType[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    title: 'MD, Endocrinologist',
    specialty: 'Hormonal Imbalance & PCOS',
    description: 'Specializes in treating complex hormonal disorders including PCOS, with 15 years of clinical experience.',
    image: '/placeholder.svg',
    badges: ['Endocrinology', 'Women\'s Health', 'Insulin Resistance'],
    availability: '2 days',
    isVerified: true
  },
  {
    id: '2',
    name: 'Emma Rodriguez',
    title: 'Registered Dietitian',
    specialty: 'PCOS Nutrition',
    description: 'Helps women with PCOS manage their symptoms through personalized nutrition plans and lifestyle modifications.',
    image: '/placeholder.svg',
    badges: ['Nutrition', 'Weight Management', 'Anti-inflammatory Diet'],
    availability: '24 hours',
    isVerified: true
  },
  {
    id: '3',
    name: 'Dr. Michael Chen',
    title: 'MD, Gynecologist',
    specialty: 'Reproductive Health',
    description: 'Focuses on reproductive health issues including PCOS management and fertility preservation.',
    image: '/placeholder.svg',
    badges: ['Gynecology', 'Fertility', 'Menstrual Health'],
    availability: '3 days',
    isVerified: true
  },
  {
    id: '4',
    name: 'Aisha Patel',
    title: 'Health Coach & PCOS Specialist',
    specialty: 'Lifestyle Management',
    description: 'Certified health coach who helps women with PCOS implement sustainable lifestyle changes for symptom management.',
    image: '/placeholder.svg',
    badges: ['Lifestyle', 'Stress Management', 'Exercise Planning'],
    availability: '1 day',
    isVerified: true
  }
];

const ExpertConnect: React.FC = () => {
  const { toast } = useToast();
  
  const handleConnect = (expert: ExpertType) => {
    toast({
      title: "Expert Connection Request Sent",
      description: `We'll connect you with ${expert.name} within ${expert.availability}.`,
    });
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Expert Connect</h1>
        <p className="text-muted-foreground mb-6">
          Get personalized guidance from healthcare professionals specialized in PCOS
        </p>
        
        <div className="grid grid-cols-1 gap-6">
          {experts.map(expert => (
            <Card key={expert.id} className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/4 bg-muted flex items-center justify-center p-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-background">
                    <img 
                      src={expert.image} 
                      alt={expert.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="md:w-3/4">
                  <CardHeader className="pb-2">
                    <CardTitle>{expert.name}</CardTitle>
                    <CardDescription>{expert.title}</CardDescription>
                    {expert.isVerified && (
                      <div className="font-medium text-sm text-nari-accent mt-1">
                        <BadgeCheck className="inline-block mr-1 h-4 w-4" /> Verified Expert
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground mb-3">
                      {expert.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {expert.badges.map((badge, index) => (
                        <Badge key={index} variant="outline" className="bg-nari-accent/10 text-nari-accent border-nari-accent/50 text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <div className="w-full flex flex-wrap justify-between items-center gap-2">
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Availability:</span> Within {expert.availability}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-nari-accent border-nari-accent hover:bg-nari-accent/10"
                        >
                          View Profile
                        </Button>
                        
                        <Button
                          size="sm"
                          className="bg-nari-primary hover:bg-nari-primary/90"
                          onClick={() => handleConnect(expert)}
                        >
                          Connect
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm mb-2">Need urgent assistance?</p>
          <Button variant="outline">
            Contact Emergency Services
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            Note: This is not a substitute for emergency medical services. 
            If you're experiencing a medical emergency, please call your local emergency number.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpertConnect;
