const { Configuration, OpenAIApi } = require("openai");

//Get AI response
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  
  const processPrompt = async (req, res) => {
    const { prompt } = req.body; // Assuming the prompt is passed in the request body
  
    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
  
      res.status(200).send({
        bot: response.data.choices[0].message.content
      });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred", message: error.message });
      }
  };
  

module.exports = {processPrompt};