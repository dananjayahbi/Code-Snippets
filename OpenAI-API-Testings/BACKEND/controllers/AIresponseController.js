const { Configuration, OpenAIApi } = require("openai");

// Create a new OpenAI configuration with your API key
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create an instance of the OpenAI API
const openai = new OpenAIApi(configuration);

// Process the user prompt and generate the bot's response
const processPrompt = async (req, res) => {
  const { conversation, prompt } = req.body; // Assuming the conversation history and prompt are passed in the request body

  try {
    // Create an array of messages from the conversation history (if available)
    const messages = conversation
      ? conversation.map((message) => ({
          role: "system", // "system" role for previous bot messages
          content: message.bot,
        }))
      : [];

    // Add the user's prompt as the latest message in the array
    messages.push({
      role: "user",
      content: prompt,
    });

    // Make a request to the OpenAI API to generate the bot's response
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // Get the content of the bot's response from the API response
    const botResponse = response.data.choices[0].message.content;

    res.status(200).send({
      bot: botResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred", message: error.message });
  }
};

module.exports = { processPrompt };
