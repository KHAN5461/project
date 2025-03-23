import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Users, Download, Grid, Zap, Globe, Cloud, Star, Crown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const featuresRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      title: 'Visual Game Editor',
      description: 'Drag and drop game objects, set properties, and see changes in real-time.',
      icon: Grid,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      title: 'Visual Scripting',
      description: 'Create game logic with a visual node-based system. No coding required.',
      icon: Code,
      color: 'from-emerald-500 to-green-500'
    },
    {
      title: 'Multiplayer Collaboration',
      description: 'Work together with your team in real-time, seeing each other\'s changes instantly.',
      icon: Users,
      color: 'from-orange-500 to-amber-500'
    },
    {
      title: 'One-Click Export',
      description: 'Export your game for web, mobile, or desktop platforms with a single click.',
      icon: Download,
      color: 'from-pink-500 to-rose-500'
    },
    {
      title: 'AI-Powered Assistance',
      description: 'Get intelligent suggestions and solutions using integrated AI technology.',
      icon: Zap,
      color: 'from-purple-500 to-violet-500'
    },
    {
      title: 'Cross-Platform Support',
      description: 'Create games that run on web, mobile, and desktop without extra configuration.',
      icon: Globe,
      color: 'from-cyan-500 to-blue-500'
    }
  ];

  const testimonials = [
    {
      text: "Cloudcraft has revolutionized our game development process. What used to take weeks now takes days.",
      author: "Jamie Chen",
      role: "Lead Developer",
      company: "Pixel Studios"
    },
    {
      text: "The visual scripting system is intuitive yet powerful. I've created complex game mechanics without writing a line of code.",
      author: "Alex Morgan",
      role: "Indie Game Developer",
      company: "Solar Games"
    },
    {
      text: "Our team uses the multiplayer feature daily. It's changed how we collaborate on game projects completely.",
      author: "Sam Taylor",
      role: "Creative Director",
      company: "Nebula Interactive"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for hobbyists and beginners",
      features: [
        "1 active project",
        "Basic game objects",
        "Standard export options",
        "Community support"
      ],
      cta: "Start Free",
      highlighted: false,
      action: () => navigate('/auth')
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "For serious indie developers",
      features: [
        "Unlimited projects",
        "Advanced game objects",
        "All export options",
        "Multiplayer collaboration",
        "Priority support"
      ],
      cta: "Get Started",
      highlighted: true,
      action: () => navigate('/auth')
    },
    {
      name: "Team",
      price: "$49",
      period: "/month",
      description: "Best for teams and studios",
      features: [
        "Everything in Pro",
        "Team management",
        "Advanced analytics",
        "Custom branding",
        "Dedicated support"
      ],
      cta: "Contact Sales",
      highlighted: false,
      action: () => window.open('mailto:sales@cloudcraft.com', '_blank')
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroElement = document.querySelector('.hero-section') as HTMLElement;
      if (heroElement) {
        heroElement.style.backgroundPositionY = `${scrollY * 0.5}px`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/editor');
    } else {
      navigate('/auth');
    }
  };

  const handleWatchDemo = () => {
    // This would typically open a video or demo
    window.open('https://example.com/demo', '_blank');
  };

  return (
    <div className="overflow-hidden">
      <div className="hero-section relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black -z-10"></div>
        
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse-soft"></div>
          <div className="absolute top-1/4 -right-24 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse-soft animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl animate-pulse-soft animation-delay-4000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.div 
              className="flex items-center justify-center mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white dark:bg-gray-800 flex items-center justify-center p-3 rounded-2xl shadow-soft-lg">
                <Cloud className="h-10 w-10 text-primary" />
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Create amazing games
              <span className="block text-primary">without coding</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-muted-foreground mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Cloudcraft is a powerful, intuitive game development platform that lets you
              build, collaborate, and publish games right from your browser.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button 
                size="lg" 
                className="h-12 px-8 button-hover"
                onClick={handleGetStarted}
              >
                {isAuthenticated ? "Go to Editor" : "Get Started"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-12 px-8 button-hover"
                onClick={handleWatchDemo}
              >
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="mt-16 rounded-xl overflow-hidden shadow-glass-xl border border-black/5 dark:border-white/5"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=1200&auto=format&fit=crop&q=80"
              alt="Cloudcraft Game Editor" 
              className="w-full h-auto object-cover rounded-xl"
            />
          </motion.div>
        </div>
      </div>
      
      <div ref={featuresRef} className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to create professional games without writing code.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full glass-card hover:shadow-glass-lg transition-all duration-300 overflow-hidden">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${feature.color} mb-4`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Developers</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of game creators who have simplified their development workflow.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full glass-card">
                  <CardContent className="pt-6">
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground italic mb-4">"{testimonial.text}"</p>
                    <div className="flex items-center">
                      <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                        <span className="text-primary font-medium">
                          {testimonial.author.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}, {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that's right for you and start creating today.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div 
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex"
              >
                <Card className={`w-full glass-card transition-all duration-300 ${
                  plan.highlighted 
                    ? 'border-primary shadow-glass-lg relative ring-1 ring-primary' 
                    : ''
                }`}>
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                      <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full flex items-center">
                        <Crown className="h-3 w-3 mr-1" />
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <ArrowRight className="h-3 w-3 text-primary" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className={`w-full button-hover ${
                        plan.highlighted ? '' : 'bg-card hover:bg-card/80'
                      }`}
                      variant={plan.highlighted ? "default" : "outline"}
                      onClick={plan.action}
                    >
                      {plan.cta}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Create Your Game?</h2>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            Join thousands of creators who are building amazing games with Cloudcraft today.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 h-12 px-8 button-hover"
            onClick={handleGetStarted}
          >
            {isAuthenticated ? "Go to Your Editor" : "Start Building Now"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
