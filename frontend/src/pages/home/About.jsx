import React from 'react'

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">About SuperMall</h1>
      
      <div className="mb-12 text-center">
        <p className="text-lg mb-6">Your premier destination for quality products at competitive prices.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="mb-3">Founded in 2023, SuperMall began with a simple mission: to create an online shopping destination that combines quality, affordability, and convenience.</p>
          <p>We work directly with manufacturers and brands to cut out middlemen and bring you the best prices possible without compromising on quality.</p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
          <ul className="space-y-3">
            <li><strong>Quality:</strong> We carefully select each product in our inventory</li>
            <li><strong>Affordability:</strong> Competitive pricing without compromise</li>
            <li><strong>Customer Service:</strong> Dedicated support for all your needs</li>
            <li><strong>Innovation:</strong> Constantly improving our platform</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap justify-between mb-16">
        <div className="w-full md:w-1/3 text-center mb-6 md:mb-0">
          <div className="text-3xl font-bold">10K+</div>
          <div className="text-sm opacity-70">Products</div>
        </div>
        <div className="w-full md:w-1/3 text-center mb-6 md:mb-0">
          <div className="text-3xl font-bold">250K+</div>
          <div className="text-sm opacity-70">Customers</div>
        </div>
        <div className="w-full md:w-1/3 text-center">
          <div className="text-3xl font-bold">25+</div>
          <div className="text-sm opacity-70">Countries</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">Our Team</h2>
          <p>Our diverse team of professionals is dedicated to making your shopping experience exceptional.</p>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">Sustainability</h2>
          <p>We're committed to sustainable practices throughout our operations and supply chain.</p>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">Careers</h2>
          <p>Join our growing team and help us revolutionize the online shopping experience.</p>
        </div>
      </div>
    </div>
  )
}

export default About