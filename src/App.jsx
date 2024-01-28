// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank" rel="noreferrer">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


import { useState, useEffect } from 'react';
import OpenAI from 'openai';
import ReactMarkdown from 'react-markdown';

const App = () => {
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const openai = new OpenAI({
      apiKey: "OPENAI_API_KEY",
      dangerouslyAllowBrowser: true,
    });

    const fetchUICriticResponse = async () => {
      setIsLoading(true);
      try {
        const result = await openai.chat.completions.create({
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "You're an expert UI critic. What can I improve in this website?" },
                {
                  type: "image_url",
                  image_url: {
                    "url": "https://i.ibb.co/sWM573X/Screenshot-2024-01-18-at-10-34-28-AM.png",
                  },
                },
              ],
            },
          ],
          "max_tokens": 1500
        });
        if (result && result.choices && result.choices.length > 0 && result.choices[0].message) {
          console.log(1, result);
          setResponse(result.choices[0].message.content);
        }
      } catch (error) {
        console.error("Error fetching AI response:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUICriticResponse();
  }, []);

  return (
    <div>
      <h3>Hi! UI Expert Here</h3>
      {isLoading ? (
        <p>Loading...</p>
      ) : response ? (
        <div>
          <h3>My Feedback:</h3>
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      ) : (
        <p>No response received.</p>
      )}
    </div>
  );
};

export default App;