import React from 'react'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Footer = () => {
  const contactMethods = [
    {
      icon: 'MessageCircle',
      label: 'WhatsApp Order',
      value: 'wa.me/919975280940',
      href: 'https://wa.me/919975280940',
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100'
    },
    {
      icon: 'Instagram', 
      label: 'Instagram',
      value: '@rl_apna_store_7',
      href: 'https://instagram.com/rl_apna_store_7',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 hover:bg-pink-100'
    },
    {
      icon: 'Facebook',
      label: 'Facebook', 
      value: 'rlapnastore7',
      href: 'https://facebook.com/rlapnastore7',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    }
  ]

  const contactInfo = [
    {
      icon: 'Phone',
      label: 'Call Us',
      values: ['9975280940', '9529685265'],
      color: 'text-primary-600'
    },
    {
      icon: 'Mail',
      label: 'Email',
      values: ['rlapnastore7@gmail.com'],
      color: 'text-secondary-600'
    },
    {
      icon: 'MapPin',
      label: 'Location',
      values: ['Pune, Maharashtra, India'],
      color: 'text-accent-600'
    }
  ]

  return (
    <footer className="bg-white border-t border-secondary-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Business Name */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-display font-bold text-secondary-900 mb-2">
            RL Apna Store
          </h2>
          <p className="text-secondary-600">आपकी पसंद, हमारी जिम्मेदारी</p>
        </div>

        {/* Social Media & WhatsApp */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {contactMethods.map((method, index) => (
            <a
              key={index}
              href={method.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-3 p-4 rounded-lg transition-all duration-200 ${method.bgColor} group`}
            >
              <ApperIcon 
                name={method.icon} 
                size={20} 
                className={`${method.color} group-hover:scale-110 transition-transform`} 
              />
              <div className="text-left">
                <div className="font-semibold text-secondary-900">{method.label}</div>
                <div className={`text-sm ${method.color}`}>{method.value}</div>
              </div>
            </a>
          ))}
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {contactInfo.map((info, index) => (
            <div key={index} className="flex items-start gap-3">
              <ApperIcon 
                name={info.icon} 
                size={18} 
                className={`${info.color} mt-1 flex-shrink-0`} 
              />
              <div>
                <div className="font-medium text-secondary-800 mb-1">{info.label}</div>
                {info.values.map((value, valueIndex) => (
                  <div key={valueIndex} className="text-secondary-600 text-sm">
                    {info.icon === 'Phone' ? (
                      <a 
                        href={`tel:${value}`} 
                        className="hover:text-primary-600 transition-colors"
                      >
                        {value}
                      </a>
                    ) : info.icon === 'Mail' ? (
                      <a 
                        href={`mailto:${value}`} 
                        className="hover:text-primary-600 transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <Button
            onClick={() => window.open('https://wa.me/919975280940', '_blank')}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
          >
            <ApperIcon name="MessageCircle" size={18} />
            WhatsApp पर Order करें
          </Button>
          <Button
            onClick={() => window.open('tel:9975280940', '_blank')}
            variant="secondary"
            className="flex items-center justify-center gap-2"
          >
            <ApperIcon name="Phone" size={18} />
            अभी Call करें
          </Button>
        </div>

        {/* Copyright */}
        <div className="text-center pt-6 border-t border-secondary-200">
          <p className="text-secondary-500 text-sm">
            © 2024 RL Apna Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer