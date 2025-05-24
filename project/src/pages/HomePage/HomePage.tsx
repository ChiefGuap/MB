import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Brain, Shield, Clock, Zap, Heart, Star } from 'lucide-react';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-lavender via-white to-peach py-24 md:py-32">
        <div className="container-fluid">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                Elevate Your <span className="text-sage">Mental Health</span> Journey
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8">
                Experience AI-powered therapy with real-time emotion detection. 
                Get personalized support when you need it most, all in a secure and private environment.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  to={user ? "/session" : "/register"} 
                  className="btn btn-primary px-8 py-3 text-lg"
                >
                  {user ? "Start Session" : "Get Started"}
                </Link>
                <Link 
                  to="/login" 
                  className={`btn bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-8 py-3 text-lg ${user ? 'hidden' : ''}`}
                >
                  Log In
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <img 
                src="https://images.pexels.com/photos/3755761/pexels-photo-3755761.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Mental health support" 
                className="rounded-lg shadow-xl max-w-full h-auto" 
              />
            </motion.div>
          </div>
        </div>
        
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L60,101.3C120,107,240,117,360,138.7C480,160,600,192,720,186.7C840,181,960,139,1080,117.3C1200,96,1320,96,1380,96L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container-fluid">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How Mental Boost Works</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Our innovative platform combines real-time emotion detection with AI-powered therapy to provide personalized mental health support.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Step 1 */}
            <motion.div variants={fadeIn} className="card hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="rounded-full bg-lavender w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <Brain className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Emotion Recognition</h3>
              <p className="text-gray-700 text-center">
                Our advanced webcam technology analyzes your facial expressions to detect emotions in real-time.
              </p>
            </motion.div>
            
            {/* Step 2 */}
            <motion.div variants={fadeIn} className="card hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="rounded-full bg-peach w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <Zap className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">AI Therapy Assistant</h3>
              <p className="text-gray-700 text-center">
                Connect with our AI therapist who adapts to your emotional state and provides personalized guidance.
              </p>
            </motion.div>
            
            {/* Step 3 */}
            <motion.div variants={fadeIn} className="card hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="rounded-full bg-calmBlue w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <Heart className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Continuous Support</h3>
              <p className="text-gray-700 text-center">
                Track your progress, review past sessions, and receive ongoing support tailored to your needs.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container-fluid">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Discover the powerful tools designed to support your mental wellbeing.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg p-6 shadow-soft"
            >
              <div className="rounded-full bg-sage bg-opacity-20 w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-sage" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-700">
                HIPAA-compliant platform with end-to-end encryption to keep your data safe and confidential.
              </p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-lg p-6 shadow-soft"
            >
              <div className="rounded-full bg-calmBlue bg-opacity-20 w-12 h-12 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-calmBlue" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Availability</h3>
              <p className="text-gray-700">
                Access support whenever you need it, day or night, from the comfort of your home.
              </p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg p-6 shadow-soft"
            >
              <div className="rounded-full bg-lavender bg-opacity-30 w-12 h-12 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced AI</h3>
              <p className="text-gray-700">
                Cutting-edge artificial intelligence that learns and adapts to your unique needs over time.
              </p>
            </motion.div>
            
            {/* Feature 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-lg p-6 shadow-soft"
            >
              <div className="rounded-full bg-peach bg-opacity-30 w-12 h-12 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Analysis</h3>
              <p className="text-gray-700">
                Get immediate insights into your emotional state with real-time emotion detection technology.
              </p>
            </motion.div>
            
            {/* Feature 5 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-lg p-6 shadow-soft"
            >
              <div className="rounded-full bg-sage bg-opacity-20 w-12 h-12 flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-sage" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Plan</h3>
              <p className="text-gray-700">
                Receive a customized mental wellness plan based on your goals, preferences, and progress.
              </p>
            </motion.div>
            
            {/* Feature 6 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-lg p-6 shadow-soft"
            >
              <div className="rounded-full bg-calmBlue bg-opacity-20 w-12 h-12 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
              <p className="text-gray-700">
                Monitor your mental health journey with detailed progress reports and insights.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container-fluid">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Mental Boost has helped thousands of people improve their mental wellbeing.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="card"
            >
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100" 
                  alt="Sarah Johnson" 
                  className="w-12 h-12 rounded-full object-cover mr-4" 
                />
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600">Marketing Director</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Mental Boost has been a game-changer for managing my anxiety. The emotion detection is surprisingly accurate, and the AI therapist feels genuinely supportive."
              </p>
              <div className="flex mt-4">
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
            </motion.div>
            
            {/* Testimonial 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card"
            >
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100" 
                  alt="David Chen" 
                  className="w-12 h-12 rounded-full object-cover mr-4" 
                />
                <div>
                  <h4 className="font-semibold text-gray-900">David Chen</h4>
                  <p className="text-sm text-gray-600">Software Engineer</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "As someone who was skeptical about AI therapy, I'm impressed with how personalized the experience feels. The privacy features also give me peace of mind."
              </p>
              <div className="flex mt-4">
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
            </motion.div>
            
            {/* Testimonial 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card"
            >
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100" 
                  alt="Leila Rodriguez" 
                  className="w-12 h-12 rounded-full object-cover mr-4" 
                />
                <div>
                  <h4 className="font-semibold text-gray-900">Leila Rodriguez</h4>
                  <p className="text-sm text-gray-600">Teacher</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Mental Boost helped me through a difficult period in my life. Having access to support 24/7 made all the difference. I recommend it to everyone."
              </p>
              <div className="flex mt-4">
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-sage to-calmBlue text-white">
        <div className="container-fluid">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Ready to Transform Your Mental Health Journey?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl mb-8"
            >
              Join thousands of users who have found clarity, support, and growth with Mental Boost.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link 
                to={user ? "/session" : "/register"} 
                className="btn bg-white text-sage hover:bg-gray-50 px-8 py-3 text-lg shadow-md"
              >
                {user ? "Start Your Session" : "Get Started Free"}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Security & Privacy Section */}
      <section className="py-20 bg-white">
        <div className="container-fluid">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Your Privacy & Security is Our Priority</h2>
              <p className="text-lg text-gray-700 mb-6">
                Mental Boost is built with your privacy and security as the foundation. We follow HIPAA guidelines and implement industry-leading security measures.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-sage flex items-center justify-center mt-1 mr-3">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">End-to-end encryption for all your data and communications</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-sage flex items-center justify-center mt-1 mr-3">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">HIPAA-compliant data storage and processing</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-sage flex items-center justify-center mt-1 mr-3">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Granular privacy controls that put you in charge</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-sage flex items-center justify-center mt-1 mr-3">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Regular security audits and vulnerability testing</p>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center"
            >
              <img 
                src="https://images.pexels.com/photos/5699515/pexels-photo-5699515.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Security and privacy" 
                className="rounded-lg shadow-xl max-w-full h-auto" 
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;