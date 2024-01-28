import { useState } from "react";
import OpenAI from "openai";
import ReactMarkdown from "react-markdown";

const App = () => {
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userUrl, setUserUrl] = useState("");

  console.log("Effect triggered");

  // Asynchronous function to fetch the AI response
  const fetchUICriticResponse = async () => {
    setIsLoading(true);

    console.log("Fetching AI response");

    // Initialize the OpenAI client with the API key
    const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    try {
      // Make an API request to OpenAI
      const result = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "You're an expert UI critic. What can I improve in this website?",
              },
              {
                type: "image_url",
                image_url: userUrl,
              },
            ],
          },
        ],
        max_tokens: 1500,
      });

      console.log("AI response received:", result);

      if (
        result &&
        result.choices &&
        result.choices.length > 0 &&
        result.choices[0].message
      ) {
        console.log(1, result);
        setResponse(result.choices[0].message.content);
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
    } finally {
      setIsLoading(false);
      console.log("Fetching completed");
    }
  };

  // Handle the input change event
  const handleInputChange = (event) => {
    setUserUrl(event.target.value);
  };

  return (
    <div>
      <h3>Hi! UI Expert Here</h3>
      <input
        type="text"
        placeholder="Enter the URL here"
        value={userUrl}
        onChange={handleInputChange}
      />
      <button onClick={fetchUICriticResponse}>Get Feedback</button>
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
