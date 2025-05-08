import React from 'react'
import { MapPin, Phone, Mail } from 'lucide-react'

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
      <p className="text-center mb-10 max-w-xl mx-auto">We're here to help. Reach out to our team with any questions, concerns, or feedback.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="text-center p-4">
          <Phone className="w-6 h-6 mx-auto mb-3 text-primary" />
          <h2 className="text-xl font-semibold mb-2">Call Us</h2>
          <p className="mb-2">Available Mon-Fri, 9am-5pm</p>
          <a href="tel:+1234567890" className="text-primary">+1 (234) 567-890</a>
        </div>
        
        <div className="text-center p-4">
          <Mail className="w-6 h-6 mx-auto mb-3 text-primary" />
          <h2 className="text-xl font-semibold mb-2">Email Us</h2>
          <p className="mb-2">We'll respond within 24 hours</p>
          <a href="mailto:support@supermall.com" className="text-primary">support@supermall.com</a>
        </div>
        
        <div className="text-center p-4">
          <MapPin className="w-6 h-6 mx-auto mb-3 text-primary" />
          <h2 className="text-xl font-semibold mb-2">Visit Us</h2>
          <p className="mb-2">Our headquarters</p>
          <address className="not-italic">123 Shopping Ave<br />Commerce City, ST 12345</address>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="block mb-1 text-sm">Name</label>
              <input type="text" placeholder="Your Name" className="w-full border rounded p-2" />
            </div>
            
            <div>
              <label className="block mb-1 text-sm">Email</label>
              <input type="email" placeholder="Your Email" className="w-full border rounded p-2" />
            </div>
            
            <div>
              <label className="block mb-1 text-sm">Subject</label>
              <select className="w-full border rounded p-2">
                <option disabled selected>Select a subject</option>
                <option>General Inquiry</option>
                <option>Product Question</option>
                <option>Order Status</option>
                <option>Return Request</option>
                <option>Technical Support</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-1 text-sm">Message</label>
              <textarea className="w-full border rounded p-2 h-32" placeholder="Your Message"></textarea>
            </div>
            
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Send Message</button>
          </form>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-6">Business Hours</h2>
          <table className="w-full mb-8">
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-medium">Monday</td>
                <td className="py-2">9:00 AM - 6:00 PM</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Tuesday</td>
                <td className="py-2">9:00 AM - 6:00 PM</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Wednesday</td>
                <td className="py-2">9:00 AM - 6:00 PM</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Thursday</td>
                <td className="py-2">9:00 AM - 6:00 PM</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Friday</td>
                <td className="py-2">9:00 AM - 6:00 PM</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Saturday</td>
                <td className="py-2">10:00 AM - 4:00 PM</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Sunday</td>
                <td className="py-2">Closed</td>
              </tr>
            </tbody>
          </table>
          
          <h3 className="text-xl font-semibold mb-4">FAQ</h3>
          <details className="mb-2">
            <summary className="py-2 cursor-pointer font-medium">How long does shipping take?</summary>
            <p className="pl-4 py-2">Standard shipping typically takes 3-5 business days within the continental US. Express shipping options are available at checkout.</p>
          </details>
          <details className="mb-2">
            <summary className="py-2 cursor-pointer font-medium">What is your return policy?</summary>
            <p className="pl-4 py-2">We offer a 30-day return policy on most items. Please see our Returns & Refunds page for more details.</p>
          </details>
          <details>
            <summary className="py-2 cursor-pointer font-medium">Do you ship internationally?</summary>
            <p className="pl-4 py-2">Yes, we ship to over 25 countries worldwide. International shipping rates and delivery times vary by location.</p>
          </details>
        </div>
      </div>
    </div>
  )
}

export default Contact