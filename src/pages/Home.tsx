import FeaturedProjects from '../components/FeaturedProjects'
import HeroSection from '../components/HeroSection'
import CategoriesSection from '../components/CategoriesSection'
import HowItWorks from '../components/HowItWorks'
import WhyChooseUs from '../components/WhyChooseUs'
import TestimonialsSection from '../components/TestimonialsSection'
import NewsletterSection from '../components/NewsletterSection'
import type { Product } from '../types'

const mockProjects: Product[] = [
  {
    _id: '1',
    title: 'SaaS Dashboard Kit',
    description: 'React + Tailwind admin dashboard with charts, billing, and user management ready for production.',
    techStack: ['React', 'Tailwind', 'Node.js'],
    difficulty: 'Advanced',
    price: 129,
    thumbnail: 'https://images.pexels.com/photos/1181243/pexels-photo-1181243.jpeg',
    gallery: [],
    deliveryType: 'Instant download',
  },
  {
    _id: '2',
    title: 'Landing Page Bundle',
    description: 'Collection of high-converting landing pages built with HTML, CSS, and vanilla JavaScript components.',
    techStack: ['HTML', 'CSS', 'JavaScript'],
    difficulty: 'Intermediate',
    price: 79,
    thumbnail: 'https://images.pexels.com/photos/6476589/pexels-photo-6476589.jpeg',
    gallery: [],
    deliveryType: 'Instant download',
  },
  {
    _id: '3',
    title: 'AI Startup Template',
    description: 'Full-stack MERN starter with authentication, pricing tiers, and blog ready for AI SaaS companies.',
    techStack: ['React', 'Express.js', 'MongoDB'],
    difficulty: 'Advanced',
    price: 149,
    thumbnail: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
    gallery: [],
    deliveryType: 'Manual delivery',
  },
]

const Home = () => {
  return (
    <div className="space-y-16">
      <HeroSection />
      <FeaturedProjects projects={mockProjects} />
      <CategoriesSection />
      <HowItWorks />
      <WhyChooseUs />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  )
}

export default Home
