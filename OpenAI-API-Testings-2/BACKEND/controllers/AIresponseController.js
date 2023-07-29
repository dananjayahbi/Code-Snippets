const { Configuration, OpenAIApi } = require('openai');
const multer = require('multer');
const path = require('path');

// Create a new OpenAI configuration with your API key
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create an instance of the OpenAI API
const openai = new OpenAIApi(configuration);

// Function to get the bot's response in chunks
const getBotResponseInChunks = async (prompt, messages, fullBotResponse, res) => {
  try {
    // Make a request to the OpenAI API to generate the bot's response
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 200,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // Get the content of the bot's response from the API response
    const botResponse = response.data.choices[0].message.content;

    fullBotResponse += botResponse;

    // Check if the response contains the full code or reached the token limit
    const isCompleteCode = botResponse.includes("class Calculator");
    const tokenCount = response.data.choices[0].message.total_tokens;

    if (isCompleteCode || tokenCount >= 1000) {
      res.status(200).send({
        bot: fullBotResponse,
      });
    } else {
      // Continue fetching the next chunk
      const lastMessageTimestamp = response.data.choices[0].message.created;
      messages.push({ role: 'system', content: botResponse, created: lastMessageTimestamp });

      getBotResponseInChunks(prompt, messages, fullBotResponse, res);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred', message: error.message });
  }
};

// Process the user prompt and generate the complete bot's response
const processPrompt = async (req, res) => {
  const { prompt } = req.body; // Assuming the prompt is passed in the request body

  try {
    // Check if a file was uploaded (req.file contains the file details if uploaded)
    const uploadedFile = req.file;
    let messages = [{ role: 'user', content: prompt }];

    // If a file was uploaded, add its content to the messages
    if (uploadedFile) {
      const fileContent = // Read the content of the uploaded file using fs.readFileSync or any other method
      messages.push({ role: 'system', content: fileContent, created: Date.now() });
    }

    // Start with the user prompt
    let fullBotResponse = '';

    // Start recursive fetching of chunks
    await getBotResponseInChunks(prompt, messages, fullBotResponse, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred', message: error.message });
  }
};

module.exports = { processPrompt };
