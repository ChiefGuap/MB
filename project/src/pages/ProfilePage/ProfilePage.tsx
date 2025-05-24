import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { User, Lock, Bell, Shield, Upload } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    dob: '',
    gender: '',
    phone: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
    },
    medicalHistory: '',
    therapyGoals: '',
    communicationStyle: 'direct',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(user?.profilePicture || null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would save the data to the backend here
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-neutral-50">
      <motion.div 
        className="container-fluid"
        initial="hidden"
        animate="visible"
        variants={pageVariants}
      >
        <div className="mb-12 text-center">
          <motion.h1 variants={itemVariants} className="text-3xl font-bold text-gray-900">
            My Profile
          </motion.h1>
          <motion.p variants={itemVariants} className="text-gray-600">
            Manage your personal information and preferences
          </motion.p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {/* Profile Header */}
            <motion.div 
              variants={itemVariants}
              className="relative bg-gradient-to-r from-sage to-calmBlue h-48"
            >
              <div className="absolute -bottom-16 left-8">
                <div className="relative">
                  <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white">
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-100">
                        <User className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-sage text-white rounded-full p-2 cursor-pointer hover:bg-opacity-90 transition-colors">
                    <Upload className="h-4 w-4" />
                    <input 
                      type="file" 
                      id="profile-image" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
            </motion.div>

            <div className="pt-20 pb-6 px-8">
              <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user?.name || 'User'}</h2>
                  <p className="text-gray-600">{user?.email || 'user@example.com'}</p>
                </div>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </motion.div>

              {/* Profile Tabs */}
              <motion.div variants={itemVariants} className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('personal')}
                    className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'personal'
                        ? 'border-sage text-sage'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <User className="inline-block h-4 w-4 mr-2" />
                    Personal Information
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'security'
                        ? 'border-sage text-sage'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Lock className="inline-block h-4 w-4 mr-2" />
                    Security
                  </button>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'notifications'
                        ? 'border-sage text-sage'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Bell className="inline-block h-4 w-4 mr-2" />
                    Notifications
                  </button>
                  <button
                    onClick={() => setActiveTab('privacy')}
                    className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'privacy'
                        ? 'border-sage text-sage'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Shield className="inline-block h-4 w-4 mr-2" />
                    Privacy
                  </button>
                </nav>
              </motion.div>

              {/* Profile Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                key={activeTab}
              >
                {activeTab === 'personal' && (
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-8">
                      {/* Basic Information */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="form-group">
                            <label htmlFor="fullName" className="form-label">Full Name</label>
                            <input
                              type="text"
                              id="fullName"
                              name="fullName"
                              value={profileData.fullName}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="form-input"
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={profileData.email}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="form-input"
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="dob" className="form-label">Date of Birth</label>
                            <input
                              type="date"
                              id="dob"
                              name="dob"
                              value={profileData.dob}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="form-input"
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="gender" className="form-label">Gender Identity</label>
                            <select
                              id="gender"
                              name="gender"
                              value={profileData.gender}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="form-input"
                            >
                              <option value="">Select gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="non-binary">Non-binary</option>
                              <option value="other">Other</option>
                              <option value="prefer-not-to-say">Prefer not to say</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label htmlFor="phone" className="form-label">Phone Number</label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={profileData.phone}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="form-input"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Emergency Contact */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="form-group">
                            <label htmlFor="emergencyName" className="form-label">Contact Name</label>
                            <input
                              type="text"
                              id="emergencyName"
                              name="emergencyContact.name"
                              value={profileData.emergencyContact.name}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="form-input"
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="emergencyRelationship" className="form-label">Relationship</label>
                            <input
                              type="text"
                              id="emergencyRelationship"
                              name="emergencyContact.relationship"
                              value={profileData.emergencyContact.relationship}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="form-input"
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="emergencyPhone" className="form-label">Phone Number</label>
                            <input
                              type="tel"
                              id="emergencyPhone"
                              name="emergencyContact.phone"
                              value={profileData.emergencyContact.phone}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="form-input"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Medical Information */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Health Information</h3>
                        <div className="grid grid-cols-1 gap-6">
                          <div className="form-group">
                            <label htmlFor="medicalHistory" className="form-label">Medical History (Optional)</label>
                            <textarea
                              id="medicalHistory"
                              name="medicalHistory"
                              rows={4}
                              value={profileData.medicalHistory}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="form-input"
                              placeholder="Share any relevant medical history that might be helpful for your therapy sessions"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Therapy Preferences */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Therapy Preferences</h3>
                        <div className="grid grid-cols-1 gap-6">
                          <div className="form-group">
                            <label htmlFor="therapyGoals" className="form-label">Therapy Goals</label>
                            <textarea
                              id="therapyGoals"
                              name="therapyGoals"
                              rows={4}
                              value={profileData.therapyGoals}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="form-input"
                              placeholder="What do you hope to achieve through therapy?"
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="communicationStyle" className="form-label">Preferred Communication Style</label>
                            <select
                              id="communicationStyle"
                              name="communicationStyle"
                              value={profileData.communicationStyle}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="form-input"
                            >
                              <option value="direct">Direct and straightforward</option>
                              <option value="supportive">Supportive and encouraging</option>
                              <option value="analytical">Analytical and logical</option>
                              <option value="empathetic">Empathetic and understanding</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {isEditing && (
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="btn btn-primary"
                          >
                            Save Changes
                          </button>
                        </div>
                      )}
                    </div>
                  </form>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Account Security</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">Password</h4>
                            <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                          </div>
                          <button className="btn bg-white border border-gray-300 hover:bg-gray-50 text-gray-700">
                            Change
                          </button>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">Two-factor authentication</h4>
                            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                          </div>
                          <button className="btn bg-white border border-gray-300 hover:bg-gray-50 text-gray-700">
                            Enable
                          </button>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">Active sessions</h4>
                            <p className="text-sm text-gray-500">Manage your active sessions</p>
                          </div>
                          <button className="btn bg-white border border-gray-300 hover:bg-gray-50 text-gray-700">
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">Email notifications</h4>
                            <p className="text-sm text-gray-500">Receive updates about your account via email</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sage peer-focus:ring-offset-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">Session reminders</h4>
                            <p className="text-sm text-gray-500">Get reminders before your scheduled sessions</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sage peer-focus:ring-offset-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">Progress updates</h4>
                            <p className="text-sm text-gray-500">Receive weekly progress reports and insights</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sage peer-focus:ring-offset-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">Data sharing</h4>
                            <p className="text-sm text-gray-500">Allow anonymous data to be used for improving our services</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sage peer-focus:ring-offset-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">Session recordings</h4>
                            <p className="text-sm text-gray-500">Allow sessions to be recorded for your personal review</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sage peer-focus:ring-offset-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
                          </label>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Data deletion</h4>
                          <p className="text-sm text-gray-500 mb-4">Delete all your personal data and session history</p>
                          <button className="btn bg-white border border-red-300 text-red-600 hover:bg-red-50">
                            Request data deletion
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;