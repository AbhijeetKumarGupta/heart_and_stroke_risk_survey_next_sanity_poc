export default function Body() {
    const riskData = {
      "Risk to Manage": [
        { name: "Diet", description: "Unhealthy eating habits increase health risks." },
        { name: "Smoking", description: "Smoking contributes to heart and lung diseases." },
        { name: "Stress", description: "Chronic stress impacts overall health negatively." },
      ],
      "Risk to be Aware of": [
        { name: "Exercise", description: "Regular exercise can improve heart health." },
        { name: "Alcohol", description: "Excessive alcohol consumption raises health risks." },
        { name: "Cholesterol", description: "High cholesterol levels may lead to heart issues." },
      ],
      "Keep it Up": [
        { name: "Sleep", description: "Adequate sleep supports overall well-being." },
        { name: "Hydration", description: "Drinking water is vital for body functions." },
        { name: "Heart Checkups", description: "Routine checkups can prevent major health problems." },
      ],
    };
  
    return (
      <main className="mt-16">
        <div className="px-4">
          <section className="mb-8">
            <h1 className="text-2xl text-red-600 mb-5">Your Risk Factors</h1>
            <p className="mb-6">Understanding your risk factors is the first step toward a healthier future. Here are the key areas to focus on:</p>
            
            <div className="mb-6">
              <h2 className="text-xl text-red-600 mb-4">Risk to Manage</h2>
              {riskData["Risk to Manage"]?.map((factor, index) => (
                <div key={index} className="border border-gray-300 p-4 mb-5 rounded-md">
                  <h3 className="text-lg text-black mb-2">{factor.name}</h3>
                  <p className="text-sm mb-2">{factor.description}</p>
                  <a href="https://www.google.com" target="_blank" className="text-red-600 hover:underline">Learn More</a>
                </div>
              ))}
            </div>
  
            <div className="mb-6">
              <h2 className="text-xl text-red-600 mb-4">Risk to be Aware of</h2>
              {riskData["Risk to be Aware of"]?.map((factor, index) => (
                <div key={index} className="border border-gray-300 p-4 mb-5 rounded-md">
                  <h3 className="text-lg text-black mb-2">{factor.name}</h3>
                  <p className="text-sm mb-2">{factor.description}</p>
                  <a href="https://www.google.com" target="_blank" className="text-red-600 hover:underline">Learn More</a>
                </div>
              ))}
            </div>
  
            <div className="mb-6">
              <h2 className="text-xl text-red-600 mb-4">Keep it Up</h2>
              {riskData["Keep it Up"]?.map((factor, index) => (
                <div key={index} className="border border-gray-300 p-4 mb-5 rounded-md">
                  <h3 className="text-lg text-black mb-2">{factor.name}</h3>
                  <p className="text-sm mb-2">{factor.description}</p>
                  <a href="https://www.google.com" target="_blank" className="text-red-600 hover:underline">Learn More</a>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    );
  }
  